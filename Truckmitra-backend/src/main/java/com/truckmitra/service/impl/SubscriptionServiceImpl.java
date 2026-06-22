package com.truckmitra.service.impl;

import com.truckmitra.entity.common.SubscriptionPlan;
import com.truckmitra.entity.common.UserSubscription;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.LoadRepository;
import com.truckmitra.repository.common.SubscriptionPlanRepository;
import com.truckmitra.repository.common.UserSubscriptionRepository;
import com.truckmitra.repository.fleet.VehicleRepository;
import com.truckmitra.repository.load.BidRepository;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.service.common.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final LoadRepository loadRepository;
    private final BidRepository bidRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final com.truckmitra.repository.user.ShipperRepository shipperRepository;
    private final com.truckmitra.repository.user.TransporterRepository transporterRepository;
    private final com.truckmitra.service.common.BillingService billingService;
    private final com.truckmitra.service.common.AuditService auditService;

    private final com.truckmitra.service.common.RazorpaySubscriptionService razorpaySubscriptionService;

    @Override
    public List<SubscriptionPlan> getAllPlans() {
        return planRepository.findAll();
    }

    @Override
    @Transactional
    public UserSubscription subscribe(User user, Long planId) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        if (plan.getPrice() == null || plan.getPrice() <= 0) {
            // Free plan logic
            UserSubscription sub = userSubscriptionRepository.findByUser(user)
                    .orElse(UserSubscription.builder().user(user).build());
            
            sub.setPlan(plan);
            sub.setStartDate(LocalDateTime.now());
            sub.setEndDate(LocalDateTime.now().plusYears(100)); // Essentially lifetime
            sub.setStatus("ACTIVE");
            sub.setAutoRenew(false);
            return userSubscriptionRepository.save(sub);
        }

        com.razorpay.Subscription razorpaySubscription = razorpaySubscriptionService.createSubscription(plan, user);

        UserSubscription sub = userSubscriptionRepository.findByUser(user)
                .orElse(UserSubscription.builder().user(user).build());

        String action = sub.getPlan() == null ? "SUBSCRIPTION_START" : 
                       (plan.getPrice() > (sub.getPlan().getPrice() != null ? sub.getPlan().getPrice() : 0) ? "SUBSCRIPTION_UPGRADE" : "SUBSCRIPTION_DOWNGRADE");

        sub.setPlan(plan);
        sub.setRazorpaySubscriptionId(razorpaySubscription.get("id"));
        sub.setStatus("PENDING"); // Will be ACTIVE when webhook fires
        sub.setAutoRenew(true);

        UserSubscription savedSub = userSubscriptionRepository.save(sub);
        
        auditService.logAction(action, "User initiated subscription to " + plan.getName(), user);
        
        return savedSub;
    }

    @Override
    public UserSubscription getCurrentSubscription(User user) {
        return userSubscriptionRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No active subscription"));
    }

    @Override
    public boolean canPerformAction(User user, String action) {
        UserSubscription sub = userSubscriptionRepository.findByUser(user).orElse(null);
        if (sub == null || !"ACTIVE".equals(sub.getStatus())) {
            if ("LOAD_POST".equals(action) && user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
                com.truckmitra.entity.user.Shipper shipper = shipperRepository.findById(user.getId()).orElse(null);
                if (shipper == null) return false;
                Integer remaining = shipper.getFreeLoadsRemaining();
                return remaining == null || remaining > 0;
            }
            if ("BID_LIMIT".equals(action) && user.getRole() == com.truckmitra.entity.common.enums.Role.TRANSPORTER) {
                com.truckmitra.entity.user.Transporter transporter = transporterRepository.findById(user.getId()).orElse(null);
                if (transporter == null) return false;
                Integer remaining = transporter.getFreeBidsRemaining();
                return remaining == null || remaining > 0;
            }
            return false;
        }
        
        SubscriptionPlan plan = sub.getPlan();
        
        if ("LOAD_POST".equals(action)) {
            if (plan.getMaxLoads() == null || plan.getMaxLoads() == -1) return true;
            long count;
            if (user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
                count = loadRepository.countByShipperId(user.getId());
            } else {
                count = loadRepository.countByTransporterId(user.getId());
            }
            return count < plan.getMaxLoads();
        }
        
        if ("BID_LIMIT".equals(action)) {
            if (plan.getMaxBids() == null || plan.getMaxBids() == -1) return true;
            long count = bidRepository.countByTransporterId(user.getId());
            return count < plan.getMaxBids();
        }

        if ("VEHICLE_ADD".equals(action)) {
            if (plan.getMaxVehicles() == null || plan.getMaxVehicles() == -1) return true;
            long count = vehicleRepository.countByTransporterId(user.getId());
            return count < plan.getMaxVehicles();
        }

        if ("DRIVER_ADD".equals(action)) {
            if (plan.getMaxDrivers() == null || plan.getMaxDrivers() == -1) return true;
            long count = driverRepository.countByTransporterId(user.getId());
            return count < plan.getMaxDrivers();
        }

        if ("ANALYTICS".equals(action)) return Boolean.TRUE.equals(plan.getHasAnalytics());
        if ("VOICE".equals(action)) return Boolean.TRUE.equals(plan.getHasVoiceAssistant());
        
        return true;
    }
}
