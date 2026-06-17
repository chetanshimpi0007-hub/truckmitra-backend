package com.truckmitra.controller.rating;

import com.truckmitra.dto.request.rating.HelpfulVoteRequest;
import com.truckmitra.dto.request.rating.RatingRequest;
import com.truckmitra.dto.request.rating.ReviewRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.rating.RatingResponse;
import com.truckmitra.dto.response.rating.RatingSummary;
import com.truckmitra.dto.response.rating.ReviewResponse;
import com.truckmitra.dto.response.rating.UserRatingStats;
import com.truckmitra.entity.rating.RatingType;
import com.truckmitra.security.CustomUserDetails;
import com.truckmitra.service.rating.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<ApiResponse<RatingResponse>> submitRating(
            @Valid @RequestBody RatingRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        RatingResponse response = ratingService.submitRating(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Rating submitted successfully", response));
    }

    @GetMapping("/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> getRatingById(@PathVariable Long ratingId) {
        return ResponseEntity.ok(ApiResponse.success("Rating fetched", ratingService.getRatingById(ratingId)));
    }

    @GetMapping("/received")
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getMyReceivedRatings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success("Received ratings fetched", 
                ratingService.getReceivedRatings(userDetails.getId(), pageable)));
    }

    @GetMapping("/given")
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getMyGivenRatings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success("Given ratings fetched", 
                ratingService.getGivenRatings(userDetails.getId(), pageable)));
    }

    @GetMapping("/user/{userId}/received")
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getUserReceivedRatings(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success("User ratings fetched", 
                ratingService.getReceivedRatings(userId, pageable)));
    }

    @GetMapping("/user/{userId}/type/{ratingType}")
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getUserRatingsByType(
            @PathVariable Long userId,
            @PathVariable RatingType ratingType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success("User ratings by type fetched", 
                ratingService.getUserRatingsByType(userId, ratingType, pageable)));
    }

    @GetMapping("/summary/me")
    public ResponseEntity<ApiResponse<RatingSummary>> getMyRatingSummary(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Rating summary fetched", 
                ratingService.getRatingSummary(userDetails.getId())));
    }

    @GetMapping("/stats/me")
    public ResponseEntity<ApiResponse<UserRatingStats>> getMyStats(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Rating stats fetched", 
                ratingService.getUserRatingStats(userDetails.getId())));
    }

    @GetMapping("/trip/{tripId}/check/{ratingType}")
    public ResponseEntity<ApiResponse<Boolean>> checkIfRated(
            @PathVariable Long tripId,
            @PathVariable RatingType ratingType,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Check completed", 
                ratingService.checkIfRated(tripId, ratingType, userDetails.getId())));
    }

    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Review added", 
                ratingService.addReview(request, userDetails.getId())));
    }

    @GetMapping("/{ratingId}/reviews")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getReviewsForRating(
            @PathVariable Long ratingId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched", 
                ratingService.getReviewsForRating(ratingId, pageable)));
    }

    @PostMapping("/helpful")
    public ResponseEntity<ApiResponse<Void>> markHelpful(
            @Valid @RequestBody HelpfulVoteRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ratingService.markHelpful(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Marked as helpful", null));
    }

    @DeleteMapping("/helpful/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> unmarkHelpful(
            @PathVariable Long ratingId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ratingService.unmarkHelpful(ratingId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Helpful mark removed", null));
    }

    @GetMapping("/{ratingId}/helpful/check")
    public ResponseEntity<ApiResponse<Boolean>> checkHelpful(
            @PathVariable Long ratingId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Helpful check completed", 
                ratingService.checkHelpful(ratingId, userDetails.getId())));
    }

    @DeleteMapping("/admin/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> deleteRating(@PathVariable Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.ok(ApiResponse.success("Rating deleted", null));
    }

    @DeleteMapping("/admin/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        ratingService.deleteReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }

    @PutMapping("/admin/{ratingId}/verify")
    public ResponseEntity<ApiResponse<Void>> verifyRating(@PathVariable Long ratingId) {
        ratingService.verifyRating(ratingId);
        return ResponseEntity.ok(ApiResponse.success("Rating verified", null));
    }

    @PutMapping("/admin/reviews/{reviewId}/verify")
    public ResponseEntity<ApiResponse<Void>> verifyReview(@PathVariable Long reviewId) {
        ratingService.verifyReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success("Review verified", null));
    }
}
