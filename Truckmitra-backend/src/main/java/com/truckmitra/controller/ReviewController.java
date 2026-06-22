package com.truckmitra.controller;

import com.truckmitra.entity.rating.Review;
import com.truckmitra.repository.rating.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        // In a real app we'd verify the user is the author or an admin
        review.setContent(payload.get("content"));
        reviewRepository.save(review);
        return ResponseEntity.ok(Map.of("message", "Review updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        // In a real app we'd verify the user is the author or an admin
        reviewRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}
