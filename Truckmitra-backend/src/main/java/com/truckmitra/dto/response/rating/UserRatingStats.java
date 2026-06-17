package com.truckmitra.dto.response.rating;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserRatingStats {
    private Long userId;
    private Double averageRating;
    private Integer totalRatings;
    private Integer ratingsGiven;
    private Integer ratingsReceived;
    private Double averageGiven;
    private Double averageReceived;
}
