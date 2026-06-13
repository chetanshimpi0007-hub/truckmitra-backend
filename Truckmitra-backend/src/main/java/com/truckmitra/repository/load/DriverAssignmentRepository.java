package com.truckmitra.repository.load;

import com.truckmitra.entity.load.DriverAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverAssignmentRepository extends JpaRepository<DriverAssignment, Long> {
    List<DriverAssignment> findByTripId(Long tripId);
    Optional<DriverAssignment> findFirstByTripIdAndDriverIdOrderByCreatedAtDesc(Long tripId, Long driverId);
    List<DriverAssignment> findByDriverId(Long driverId);
}
