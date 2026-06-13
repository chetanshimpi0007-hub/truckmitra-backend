package com.truckmitra.repository;

import com.truckmitra.entity.load.LorryReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LorryReceiptRepository extends JpaRepository<LorryReceipt, Long> {
    Optional<LorryReceipt> findByLrNumber(String lrNumber);
    Optional<LorryReceipt> findByTripId(Long tripId);
}
