package com.truckmitra.service.rating;

import com.truckmitra.dto.request.rating.HelpfulVoteRequest;
import com.truckmitra.dto.request.rating.RatingRequest;
import com.truckmitra.dto.request.rating.ReviewRequest;
import com.truckmitra.dto.response.rating.RatingResponse;
import com.truckmitra.dto.response.rating.RatingSummary;
import com.truckmitra.dto.response.rating.ReviewResponse;
import com.truckmitra.dto.response.rating.UserRatingStats;
import com.truckmitra.entity.rating.RatingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RatingService {
    // Public
    RatingSummary getPublicRatingSummary(Long userId);
    
    // Rating Operations
    RatingResponse submitRating(RatingRequest request, Long raterId);
    RatingResponse getRatingById(Long ratingId);
    Page<RatingResponse> getReceivedRatings(Long userId, Pageable pageable);
    Page<RatingResponse> getGivenRatings(Long userId, Pageable pageable);
    Page<RatingResponse> getUserRatingsByType(Long userId, RatingType type, Pageable pageable);
    
    // Summaries and Stats
    RatingSummary getRatingSummary(Long userId);
    UserRatingStats getUserRatingStats(Long userId);
    boolean checkIfRated(Long tripId, RatingType ratingType, Long raterId);
    
    // Reviews
    ReviewResponse addReview(ReviewRequest request, Long reviewerId);
    Page<ReviewResponse> getReviewsForRating(Long ratingId, Pageable pageable);
    
    // Helpful Votes
    void markHelpful(HelpfulVoteRequest request, Long userId);
    void unmarkHelpful(Long ratingId, Long userId);
    boolean checkHelpful(Long ratingId, Long userId);
    
    // Admin Operations
    void deleteRating(Long ratingId);
    void deleteReview(Long reviewId);
    void verifyRating(Long ratingId);
    void verifyReview(Long reviewId);
}
