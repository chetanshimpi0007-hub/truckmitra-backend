package com.truckmitra.dto.response.rating;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RatingSummary {
    private Long userId;
    private String userName;
    private String userRole;
    private Double averageRating;
    private Integer totalRatings;
    private Integer fiveStarCount;
    private Integer fourStarCount;
    private Integer threeStarCount;
    private Integer twoStarCount;
    private Integer oneStarCount;
    private Integer asShipperCount;
    private Double asTransporterAvg;
    private Double asDriverAvg;
    private Double asShipperAvg;
    private Boolean showDetails;
}
