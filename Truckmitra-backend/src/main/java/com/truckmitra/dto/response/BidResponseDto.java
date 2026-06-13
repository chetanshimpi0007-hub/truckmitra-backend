package com.truckmitra.dto.response;

import com.truckmitra.entity.load.Bid;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Safe, flat DTO for Bid — prevents circular serialization through
 * the Transporter -> List<Bid> -> Transporter back-reference.
 */
public class BidResponseDto {

    private Long id;
    private BigDecimal amount;
    private String status;
    private String comment;
    private String vehicleType;
    private Integer estimatedDeliveryDays;
    private LocalDateTime createdAt;

    // Flattened transporter info
    private Long transporterId;
    private String transporterName;
    private String agencyName;
    private Double averageRating;
    private Integer totalRatings;
    private Integer totalDrivers;
    private Integer fleetSize;
    private String mobile;
    private String city;
    private String profileImageUrl;

    public BidResponseDto() {}

    /** Map a Bid entity to a safe DTO (transporter must be loaded). */
    public static BidResponseDto from(Bid bid) {
        BidResponseDto dto = new BidResponseDto();
        dto.id = bid.getId();
        dto.amount = bid.getAmount();
        dto.status = bid.getStatus() != null ? bid.getStatus().name() : null;
        dto.comment = bid.getComment();
        dto.vehicleType = bid.getVehicleType();
        dto.estimatedDeliveryDays = bid.getEstimatedDeliveryDays();
        dto.createdAt = bid.getCreatedAt();

        if (bid.getTransporter() != null) {
            dto.transporterId = bid.getTransporter().getId();
            dto.transporterName = bid.getTransporter().getFullName();
            dto.agencyName = bid.getTransporter().getAgencyName();
            dto.averageRating = bid.getTransporter().getAverageRating();
            dto.totalRatings = bid.getTransporter().getTotalRatings();
            dto.totalDrivers = bid.getTransporter().getTotalDrivers();
            dto.fleetSize = bid.getTransporter().getFleetSize();
            dto.mobile = bid.getTransporter().getMobile();
            dto.city = bid.getTransporter().getCity();
            dto.profileImageUrl = bid.getTransporter().getProfileImageUrl();
        }
        return dto;
    }

    // ── Getters ──────────────────────────────────────────────────────────────
    public Long getId() { return id; }
    public BigDecimal getAmount() { return amount; }
    public String getStatus() { return status; }
    public String getComment() { return comment; }
    public String getVehicleType() { return vehicleType; }
    public Integer getEstimatedDeliveryDays() { return estimatedDeliveryDays; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getTransporterId() { return transporterId; }
    public String getTransporterName() { return transporterName; }
    public String getAgencyName() { return agencyName; }
    public Double getAverageRating() { return averageRating; }
    public Integer getTotalRatings() { return totalRatings; }
    public Integer getTotalDrivers() { return totalDrivers; }
    public Integer getFleetSize() { return fleetSize; }
    public String getMobile() { return mobile; }
    public String getCity() { return city; }
    public String getProfileImageUrl() { return profileImageUrl; }
}
