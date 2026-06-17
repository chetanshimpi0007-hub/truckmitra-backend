package com.truckmitra.repository.rating;

import com.truckmitra.entity.rating.HelpfulVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HelpfulVoteRepository extends JpaRepository<HelpfulVote, Long> {
    Optional<HelpfulVote> findByRatingIdAndUserId(Long ratingId, Long userId);
    boolean existsByRatingIdAndUserId(Long ratingId, Long userId);
}
