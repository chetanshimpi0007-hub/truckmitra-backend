package com.truckmitra.controller.rating;

import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.rating.RatingSummary;
import com.truckmitra.service.rating.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings/public")
@RequiredArgsConstructor
public class PublicRatingController {

    private final RatingService ratingService;

    @GetMapping("/summary/{userId}")
    public ResponseEntity<ApiResponse<RatingSummary>> getPublicRatingSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Public rating summary fetched", 
                ratingService.getPublicRatingSummary(userId)));
    }
}
