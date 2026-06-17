package com.truckmitra.dto.request.rating;

import com.truckmitra.entity.rating.RatingType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RatingRequest {
    @NotNull
    private Long ratedId;
    
    @NotNull
    private Long tripId;
    
    private Long loadId;
    private Long bidId;
    
    @NotNull
    private RatingType ratingType;
    
    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
    
    private String comment;
    
    private Boolean isAnonymous = false;
}
