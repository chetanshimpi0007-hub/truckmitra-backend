package com.truckmitra.dto.response.rating;

import com.truckmitra.entity.rating.RatingType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RatingResponse {
    private Long id;
    private Long raterId;
    private String raterName;
    private String raterRole;
    private Long ratedId;
    private String ratedName;
    private String ratedRole;
    private Long tripId;
    private Long loadId;
    private Long bidId;
    private RatingType ratingType;
    private Integer rating;
    private String comment;
    private Boolean isVerified;
    private Integer helpfulCount;
    private Boolean isAnonymous;
    private Boolean isFlagged;
    private Boolean isResponseGiven;
    private String responseComment;
    private LocalDateTime respondedAt;
    private LocalDateTime createdAt;
}
