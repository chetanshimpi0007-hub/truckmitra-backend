package com.truckmitra.repository.rating;

import com.truckmitra.entity.rating.Rating;
import com.truckmitra.entity.rating.RatingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    Page<Rating> findByRatedId(Long ratedId, Pageable pageable);
    
    Page<Rating> findByRaterId(Long raterId, Pageable pageable);
    
    Page<Rating> findByRatedIdAndRatingType(Long ratedId, RatingType ratingType, Pageable pageable);
    
    Optional<Rating> findByTripIdAndRaterIdAndRatingType(Long tripId, Long raterId, RatingType ratingType);
    
    @Query("SELECT r FROM Rating r WHERE r.rated.id = :userId")
    List<Rating> findAllByRatedId(@Param("userId") Long userId);
    
    @Query("SELECT r FROM Rating r WHERE r.rater.id = :userId")
    List<Rating> findAllByRaterId(@Param("userId") Long userId);
    
    boolean existsByTripIdAndRaterIdAndRatingType(Long tripId, Long raterId, RatingType ratingType);
}
