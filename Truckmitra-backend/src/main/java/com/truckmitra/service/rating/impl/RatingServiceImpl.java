package com.truckmitra.service.rating.impl;

import com.truckmitra.dto.request.rating.HelpfulVoteRequest;
import com.truckmitra.dto.request.rating.RatingRequest;
import com.truckmitra.dto.request.rating.ReviewRequest;
import com.truckmitra.dto.response.rating.RatingResponse;
import com.truckmitra.dto.response.rating.RatingSummary;
import com.truckmitra.dto.response.rating.ReviewResponse;
import com.truckmitra.dto.response.rating.UserRatingStats;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.rating.HelpfulVote;
import com.truckmitra.entity.rating.Rating;
import com.truckmitra.entity.rating.RatingType;
import com.truckmitra.entity.rating.Review;
import com.truckmitra.entity.user.User;
import com.truckmitra.exception.BadRequestException;
import com.truckmitra.exception.ResourceNotFoundException;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.repository.rating.HelpfulVoteRepository;
import com.truckmitra.repository.rating.RatingRepository;
import com.truckmitra.repository.rating.ReviewRepository;
import com.truckmitra.service.rating.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final ReviewRepository reviewRepository;
    private final HelpfulVoteRepository helpfulVoteRepository;
    private final UserRepository userRepository;
    private final TripRepository tripRepository;

    @Override
    public RatingSummary getPublicRatingSummary(Long userId) {
        return calculateRatingSummary(userId, false);
    }

    @Override
    public RatingSummary getRatingSummary(Long userId) {
        return calculateRatingSummary(userId, true);
    }

    private RatingSummary calculateRatingSummary(Long userId, boolean showDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<Rating> receivedRatings = ratingRepository.findAllByRatedId(userId);

        int total = receivedRatings.size();
        if (total == 0) {
            return RatingSummary.builder()
                    .userId(userId)
                    .userName(user.getFullName())
                    .userRole(user.getRole().name())
                    .averageRating(0.0)
                    .totalRatings(0)
                    .fiveStarCount(0)
                    .fourStarCount(0)
                    .threeStarCount(0)
                    .twoStarCount(0)
                    .oneStarCount(0)
                    .showDetails(showDetails)
                    .build();
        }

        int sum = 0;
        int[] counts = new int[6];
        for (Rating r : receivedRatings) {
            int val = r.getRatingValue();
            sum += val;
            if (val >= 1 && val <= 5) {
                counts[val]++;
            }
        }

        double avg = (double) sum / total;

        return RatingSummary.builder()
                .userId(userId)
                .userName(user.getFullName())
                .userRole(user.getRole().name())
                .averageRating(Math.round(avg * 10.0) / 10.0)
                .totalRatings(total)
                .fiveStarCount(counts[5])
                .fourStarCount(counts[4])
                .threeStarCount(counts[3])
                .twoStarCount(counts[2])
                .oneStarCount(counts[1])
                .showDetails(showDetails)
                .build();
    }

    @Override
    @Transactional
    public RatingResponse submitRating(RatingRequest request, Long raterId) {
        if (ratingRepository.existsByTripIdAndRaterIdAndRatingType(request.getTripId(), raterId, request.getRatingType())) {
            throw new BadRequestException("You have already submitted this type of rating for this trip.");
        }

        User rater = userRepository.findById(raterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", raterId));
        User rated = userRepository.findById(request.getRatedId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getRatedId()));
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", request.getTripId()));

        Rating rating = Rating.builder()
                .rater(rater)
                .rated(rated)
                .trip(trip)
                .loadId(request.getLoadId())
                .bidId(request.getBidId())
                .ratingType(request.getRatingType())
                .ratingValue(request.getRating())
                .comment(request.getComment())
                .isAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false)
                .isVerified(false)
                .helpfulCount(0)
                .isFlagged(false)
                .isResponseGiven(false)
                .build();

        rating = ratingRepository.save(rating);
        return mapToRatingResponse(rating);
    }

    @Override
    public RatingResponse getRatingById(Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating", "id", ratingId));
        return mapToRatingResponse(rating);
    }

    @Override
    public Page<RatingResponse> getReceivedRatings(Long userId, Pageable pageable) {
        return ratingRepository.findByRatedId(userId, pageable).map(this::mapToRatingResponse);
    }

    @Override
    public Page<RatingResponse> getGivenRatings(Long userId, Pageable pageable) {
        return ratingRepository.findByRaterId(userId, pageable).map(this::mapToRatingResponse);
    }

    @Override
    public Page<RatingResponse> getUserRatingsByType(Long userId, RatingType type, Pageable pageable) {
        return ratingRepository.findByRatedIdAndRatingType(userId, type, pageable).map(this::mapToRatingResponse);
    }

    @Override
    public UserRatingStats getUserRatingStats(Long userId) {
        List<Rating> received = ratingRepository.findAllByRatedId(userId);
        List<Rating> given = ratingRepository.findAllByRaterId(userId);
        
        double avgReceived = received.stream().mapToInt(Rating::getRatingValue).average().orElse(0.0);
        double avgGiven = given.stream().mapToInt(Rating::getRatingValue).average().orElse(0.0);
        
        return UserRatingStats.builder()
                .userId(userId)
                .averageRating(Math.round(avgReceived * 10.0) / 10.0)
                .totalRatings(received.size() + given.size())
                .ratingsGiven(given.size())
                .ratingsReceived(received.size())
                .averageGiven(Math.round(avgGiven * 10.0) / 10.0)
                .averageReceived(Math.round(avgReceived * 10.0) / 10.0)
                .build();
    }

    @Override
    public boolean checkIfRated(Long tripId, RatingType ratingType, Long raterId) {
        return ratingRepository.existsByTripIdAndRaterIdAndRatingType(tripId, raterId, ratingType);
    }

    @Override
    @Transactional
    public ReviewResponse addReview(ReviewRequest request, Long reviewerId) {
        Rating rating = ratingRepository.findById(request.getRatingId())
                .orElseThrow(() -> new ResourceNotFoundException("Rating", "id", request.getRatingId()));
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reviewerId));

        Review review = Review.builder()
                .rating(rating)
                .reviewer(reviewer)
                .content(request.getContent())
                .isVerified(false)
                .isHelpful(false)
                .build();

        review = reviewRepository.save(review);
        return mapToReviewResponse(review);
    }

    @Override
    public Page<ReviewResponse> getReviewsForRating(Long ratingId, Pageable pageable) {
        return reviewRepository.findByRatingId(ratingId, pageable).map(this::mapToReviewResponse);
    }

    @Override
    @Transactional
    public void markHelpful(HelpfulVoteRequest request, Long userId) {
        if (helpfulVoteRepository.existsByRatingIdAndUserId(request.getRatingId(), userId)) {
            return;
        }

        Rating rating = ratingRepository.findById(request.getRatingId())
                .orElseThrow(() -> new ResourceNotFoundException("Rating", "id", request.getRatingId()));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        HelpfulVote vote = HelpfulVote.builder()
                .rating(rating)
                .user(user)
                .build();
        helpfulVoteRepository.save(vote);

        rating.setHelpfulCount(rating.getHelpfulCount() + 1);
        ratingRepository.save(rating);
    }

    @Override
    @Transactional
    public void unmarkHelpful(Long ratingId, Long userId) {
        helpfulVoteRepository.findByRatingIdAndUserId(ratingId, userId).ifPresent(vote -> {
            helpfulVoteRepository.delete(vote);
            Rating rating = vote.getRating();
            if (rating.getHelpfulCount() > 0) {
                rating.setHelpfulCount(rating.getHelpfulCount() - 1);
                ratingRepository.save(rating);
            }
        });
    }

    @Override
    public boolean checkHelpful(Long ratingId, Long userId) {
        return helpfulVoteRepository.existsByRatingIdAndUserId(ratingId, userId);
    }

    @Override
    public void deleteRating(Long ratingId) {
        ratingRepository.deleteById(ratingId);
    }

    @Override
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    @Override
    @Transactional
    public void verifyRating(Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating", "id", ratingId));
        rating.setIsVerified(true);
        ratingRepository.save(rating);
    }

    @Override
    @Transactional
    public void verifyReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        review.setIsVerified(true);
        reviewRepository.save(review);
    }

    private RatingResponse mapToRatingResponse(Rating r) {
        String raterName = r.getIsAnonymous() ? "Anonymous" : r.getRater().getFullName();
        return RatingResponse.builder()
                .id(r.getId())
                .raterId(r.getRater().getId())
                .raterName(raterName)
                .raterRole(r.getRater().getRole().name())
                .ratedId(r.getRated().getId())
                .ratedName(r.getRated().getFullName())
                .ratedRole(r.getRated().getRole().name())
                .tripId(r.getTrip() != null ? r.getTrip().getId() : null)
                .loadId(r.getLoadId())
                .bidId(r.getBidId())
                .ratingType(r.getRatingType())
                .rating(r.getRatingValue())
                .comment(r.getComment())
                .isVerified(r.getIsVerified())
                .helpfulCount(r.getHelpfulCount())
                .isAnonymous(r.getIsAnonymous())
                .isFlagged(r.getIsFlagged())
                .isResponseGiven(r.getIsResponseGiven())
                .responseComment(r.getResponseComment())
                .respondedAt(r.getRespondedAt())
                .createdAt(r.getCreatedAt())
                .build();
    }

    private ReviewResponse mapToReviewResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .reviewerId(r.getReviewer().getId())
                .reviewerName(r.getReviewer().getFullName())
                .reviewerRole(r.getReviewer().getRole().name())
                .content(r.getContent())
                .isVerified(r.getIsVerified())
                .isHelpful(r.getIsHelpful())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
