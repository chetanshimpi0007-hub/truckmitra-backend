package com.truckmitra.dto.request.rating;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull
    private Long ratingId;
    
    @NotBlank
    private String content;
}
