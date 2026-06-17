package com.truckmitra.dto.response.rating;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerRole;
    private String content;
    private Boolean isVerified;
    private Boolean isHelpful;
    private LocalDateTime createdAt;
}
