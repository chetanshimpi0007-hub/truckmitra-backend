package com.truckmitra.repository.load;

import com.truckmitra.entity.load.ProofOfDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PODRepository extends JpaRepository<ProofOfDelivery, Long> {
    Optional<ProofOfDelivery> findByTripId(Long tripId);
}
