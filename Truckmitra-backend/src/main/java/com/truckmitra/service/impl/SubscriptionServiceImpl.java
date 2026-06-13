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
    private final com.truckmitra.service.common.BillingService billingService;
    private final com.truckmitra.service.common.AuditService auditService;

    @Override
    public List<SubscriptionPlan> getAllPlans() {
        return planRepository.findAll();
    }

    @Override
    @Transactional
    public UserSubscription subscribe(User user, Long planId) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        UserSubscription sub = userSubscriptionRepository.findByUser(user)
                .orElse(UserSubscription.builder().user(user).build());

        String action = sub.getPlan() == null ? "SUBSCRIPTION_START" : 
                       (plan.getPrice() > sub.getPlan().getPrice() ? "SUBSCRIPTION_UPGRADE" : "SUBSCRIPTION_DOWNGRADE");

        sub.setPlan(plan);
        sub.setStartDate(LocalDateTime.now());
        sub.setEndDate(LocalDateTime.now().plusMonths(1));
        sub.setStatus("ACTIVE");

        UserSubscription savedSub = userSubscriptionRepository.save(sub);
        billingService.generateInvoice(savedSub);
        
        auditService.logAction(action, "User changed plan to " + plan.getName(), user);
        
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
            if ("LOAD_POST".equals(action) && user instanceof com.truckmitra.entity.user.Shipper shipper) {
                return shipper.getFreeLoadsRemaining() != null && shipper.getFreeLoadsRemaining() > 0;
            }
            if ("BID_LIMIT".equals(action) && user instanceof com.truckmitra.entity.user.Transporter transporter) {
                return transporter.getFreeBidsRemaining() != null && transporter.getFreeBidsRemaining() > 0;
            }
            return false;
        }
        
        SubscriptionPlan plan = sub.getPlan();
        
        if ("LOAD_POST".equals(action)) {
            if (plan.getLoadPostLimit() == -1) return true;
            long count;
            if (user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
                count = loadRepository.countByShipperId(user.getId());
            } else {
                count = loadRepository.countByTransporterId(user.getId());
            }
            return count < plan.getLoadPostLimit();
        }
        
        if ("BID_LIMIT".equals(action)) {
            if (plan.getBidLimit() == -1) return true;
            long count = bidRepository.countByTransporterId(user.getId());
            return count < plan.getBidLimit();
        }

        if ("VEHICLE_ADD".equals(action)) {
            if (plan.getFleetLimit() == -1) return true;
            long count = vehicleRepository.countByTransporterId(user.getId());
            return count < plan.getFleetLimit();
        }

        if ("DRIVER_ADD".equals(action)) {
            if (plan.getFleetLimit() == -1) return true;
            long count = driverRepository.countByTransporterId(user.getId());
            return count < plan.getFleetLimit();
        }

        if ("ANALYTICS".equals(action)) return plan.getHasAnalytics();
        if ("VOICE".equals(action)) return plan.getHasVoiceAssistant();
        
        return true;
    }
}
