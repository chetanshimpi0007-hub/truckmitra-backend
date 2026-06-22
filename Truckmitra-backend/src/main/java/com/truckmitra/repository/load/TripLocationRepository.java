package com.truckmitra.repository.load;

import com.truckmitra.entity.load.TripLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripLocationRepository extends JpaRepository<TripLocation, Long> {
    List<TripLocation> findByTripIdOrderByTimestampAsc(Long tripId);
    Optional<TripLocation> findTopByTripIdOrderByTimestampDesc(Long tripId);
    List<TripLocation> findTop50ByTripIdOrderByTimestampDesc(Long tripId);
}
