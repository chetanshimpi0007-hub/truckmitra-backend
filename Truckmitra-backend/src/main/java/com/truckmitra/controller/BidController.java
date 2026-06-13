package com.truckmitra.controller;

import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.BidResponseDto;
import com.truckmitra.entity.common.enums.BidStatus;
import com.truckmitra.entity.load.Bid;
import com.truckmitra.entity.user.User;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.repository.user.TransporterRepository;
import com.truckmitra.repository.load.BidRepository;
import com.truckmitra.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;
    private final UserRepository userRepository;
    private final BidRepository bidRepository;
    private final TransporterRepository transporterRepository;

    /**
     * POST /api/bids — Transporter places a bid on a load.
     *
     * FIX: Use @AuthenticationPrincipal UserDetails (consistent with all other controllers)
     * instead of SecurityUtils.getCurrentUserId() which could fail on non-numeric usernames.
     */
    @PostMapping
    public ResponseEntity<?> placeBid(
            @RequestBody BidRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Resolve user by mobile (primary) or email (fallback) — same pattern as all other controllers
            User user = userRepository.findByMobile(userDetails.getUsername())
                    .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername())
                            .orElseThrow(() -> new RuntimeException("User not found")));

            Transporter transporter = transporterRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Transporter profile not found. Please complete your transporter registration."));

            java.math.BigDecimal amt = req.getAmount() == null
                    ? null
                    : java.math.BigDecimal.valueOf(req.getAmount());

            Bid saved = bidService.placeBid(
                    req.getLoadId(), transporter, amt,
                    req.getEstimatedDeliveryDays(),
                    req.getRemarks(),
                    req.getVehicleType());

            return ResponseEntity.ok(ApiResponse.success("Bid placed successfully", BidResponseDto.from(saved)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/bids/load/{loadId} — Shipper views all bids for their load.
     * Returns safe BidResponseDto list (no circular serialization).
     * Sorted by amount ASC (lowest bid first).
     */
    @GetMapping("/load/{loadId}")
    public ResponseEntity<ApiResponse<List<BidResponseDto>>> getBidsForLoad(@PathVariable Long loadId) {
        List<BidResponseDto> bids = bidService.getBidsForLoadAsDto(loadId);
        return ResponseEntity.ok(ApiResponse.success("Bids fetched successfully", bids));
    }

    /**
     * GET /api/bids/load/{loadId}/count — Quick bid count for a load.
     */
    @GetMapping("/load/{loadId}/count")
    public ResponseEntity<ApiResponse<Long>> getBidCount(@PathVariable Long loadId) {
        long count = bidRepository.countByLoadId(loadId);
        return ResponseEntity.ok(ApiResponse.success("Bid count fetched", count));
    }

    /**
     * GET /api/bids/my/accepted — All accepted bids for the authenticated transporter.
     */
    @GetMapping("/my/accepted")
    public ResponseEntity<ApiResponse<List<BidResponseDto>>> getMyAcceptedBids(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElseThrow());
        List<Bid> bids = bidRepository.findByTransporterIdAndStatus(user.getId(), BidStatus.ACCEPTED);
        List<BidResponseDto> dtos = bids.stream().map(BidResponseDto::from).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Accepted bids fetched", dtos));
    }

    /**
     * GET /api/bids/my — All bids by the authenticated transporter.
     */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BidResponseDto>>> getMyBids(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElseThrow());
        List<Bid> bids = bidRepository.findByTransporterId(user.getId());
        List<BidResponseDto> dtos = bids.stream().map(BidResponseDto::from).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("My bids fetched", dtos));
    }

    /**
     * PUT /api/bids/{bidId}/accept — Shipper accepts a bid.
     * Automatically rejects all other pending bids for the same load.
     * Creates a trip and sends notifications.
     */
    @PutMapping("/{bidId}/accept")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId) {
        try {
            Bid bid = bidService.acceptBid(bidId);
            return ResponseEntity.ok(ApiResponse.success("Bid accepted and load assigned", BidResponseDto.from(bid)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PUT /api/bids/{bidId}/reject — Shipper rejects a specific bid.
     */
    @PutMapping("/{bidId}/reject")
    public ResponseEntity<?> rejectBid(@PathVariable Long bidId) {
        try {
            Bid bid = bidService.rejectBid(bidId);
            return ResponseEntity.ok(ApiResponse.success("Bid rejected", BidResponseDto.from(bid)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Inner DTO for bid placement request ─────────────────────────────────
    public static class BidRequest {
        private Long loadId;
        private Double amount;
        private String remarks;
        private String vehicleType;
        private Integer estimatedDeliveryDays;

        public Long getLoadId() { return loadId; }
        public void setLoadId(Long loadId) { this.loadId = loadId; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
        public String getVehicleType() { return vehicleType; }
        public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
        public Integer getEstimatedDeliveryDays() { return estimatedDeliveryDays; }
        public void setEstimatedDeliveryDays(Integer estimatedDeliveryDays) { this.estimatedDeliveryDays = estimatedDeliveryDays; }
    }
}
