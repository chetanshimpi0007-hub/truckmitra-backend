package com.truckmitra.repository.load;

import com.truckmitra.entity.load.LoadRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoadRecommendationRepository extends JpaRepository<LoadRecommendation, Long> {
    List<LoadRecommendation> findByTransporterIdOrderByMatchScoreDesc(Long transporterId);
    List<LoadRecommendation> findByLoadIdOrderByMatchScoreDesc(Long loadId);
    Optional<LoadRecommendation> findByLoadIdAndTransporterId(Long loadId, Long transporterId);
}
