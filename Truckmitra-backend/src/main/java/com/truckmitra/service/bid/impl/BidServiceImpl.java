package com.truckmitra.service.bid.impl;

import com.truckmitra.dto.response.BidResponseDto;
import com.truckmitra.entity.Notification;
import com.truckmitra.entity.common.enums.BidStatus;
import com.truckmitra.entity.load.Bid;
import com.truckmitra.entity.load.Load;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.repository.LoadRepository;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.repository.load.BidRepository;
import com.truckmitra.service.BidService;
import com.truckmitra.service.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepository;
    private final LoadRepository loadRepository;
    private final NotificationService notificationService;
    private final com.truckmitra.service.TripService tripService;
    private final com.truckmitra.service.common.SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Bid placeBid(Long loadId, Transporter transporter, BigDecimal amount, Integer estimatedDays, String message, String vehicleType) {
        if (transporter.getIsVerified() == null || !transporter.getIsVerified()) {
            throw new RuntimeException("Your transporter account is not verified by admin. You cannot place bids.");
        }
        if (!subscriptionService.canPerformAction(transporter, "BID_LIMIT")) {
            throw new RuntimeException("Bid limit reached for your current subscription. Please upgrade.");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be > 0");
        }
        Load load = loadRepository.findById(loadId)
                .orElseThrow(() -> new RuntimeException("Load not found"));

        Bid bid = new Bid();
        bid.setLoad(load);
        bid.setTransporter(transporter);
        bid.setAmount(amount);
        bid.setEstimatedDeliveryDays(estimatedDays);
        bid.setVehicleType(vehicleType);
        bid.setComment(message);
        bid.setStatus(BidStatus.PENDING);

        Bid saved = bidRepository.save(bid);

        // Notify shipper that a new bid was received
        try {
            if (load.getShipper() != null) {
                notificationService.sendNotification(
                    load.getShipper(),
                    "New Bid Received",
                    transporter.getFullName() + " placed a bid of ₹" + amount + " on your load: "
                        + load.getMaterialType() + " (" + load.getSource() + " → " + load.getDestination() + ")",
                    Notification.NotificationType.BID
                );
            }
        } catch (Exception ignored) {}

        return saved;
    }

    @Override
    public List<Bid> getBidsForLoad(Long loadId) {
        Load load = loadRepository.findById(loadId)
                .orElseThrow(() -> new RuntimeException("Load not found"));
        return bidRepository.findByLoad(load);
    }

    @Override
    public List<BidResponseDto> getBidsForLoadAsDto(Long loadId) {
        // Uses JOIN FETCH to eagerly load transporter — avoids LazyInitializationException
        List<Bid> bids = bidRepository.findByLoadIdWithTransporter(loadId);
        return bids.stream()
                .map(BidResponseDto::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Bid acceptBid(Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));
        bid.setStatus(BidStatus.ACCEPTED);
        Bid accepted = bidRepository.save(bid);

        // Reject all other PENDING bids for the same load + notify each rejected transporter
        List<Bid> others = bidRepository.findByLoad(accepted.getLoad());
        for (Bid b : others) {
            if (!b.getId().equals(accepted.getId()) && b.getStatus() == BidStatus.PENDING) {
                b.setStatus(BidStatus.REJECTED);
                bidRepository.save(b);
                try {
                    notificationService.sendNotification(
                        b.getTransporter(),
                        "Bid Not Selected",
                        "Your bid of ₹" + b.getAmount() + " for load '"
                            + accepted.getLoad().getMaterialType() + "' was not selected. Keep bidding!",
                        Notification.NotificationType.BID
                    );
                } catch (Exception ignored) {}
            }
        }

        // Update load: assign winning transporter + mark ASSIGNED
        Load load = accepted.getLoad();
        load.setTransporter(accepted.getTransporter());
        load.setStatus(com.truckmitra.entity.common.enums.LoadStatus.ASSIGNED);
        loadRepository.save(load);

        // Notify winning transporter
        try {
            notificationService.sendNotification(
                accepted.getTransporter(),
                "🎉 Bid Accepted!",
                "Congratulations! Your bid of ₹" + accepted.getAmount() + " for '"
                    + load.getMaterialType() + "' (" + load.getSource() + " → " + load.getDestination()
                    + ") has been accepted. Please assign a driver.",
                Notification.NotificationType.BID
            );
        } catch (Exception ignored) {}

        // Notify shipper confirmation
        try {
            if (load.getShipper() != null) {
                notificationService.sendNotification(
                    load.getShipper(),
                    "Transporter Assigned",
                    "You accepted a bid from " + accepted.getTransporter().getFullName()
                        + " for your load '" + load.getMaterialType() + "'. Trip will begin shortly.",
                    Notification.NotificationType.TRIP
                );
            }
        } catch (Exception ignored) {}

        // Auto-create trip
        try {
            tripService.createInitialTrip(load.getId(), accepted.getId());
        } catch (Exception ignored) {}

        return accepted;
    }

    @Override
    @Transactional
    public Bid rejectBid(Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));
        bid.setStatus(BidStatus.REJECTED);
        Bid rejected = bidRepository.save(bid);
        try {
            notificationService.sendNotification(
                rejected.getTransporter(),
                "Bid Rejected",
                "Your bid of ₹" + rejected.getAmount() + " was rejected by the shipper.",
                Notification.NotificationType.BID
            );
        } catch (Exception ignored) {}
        return rejected;
    }
}