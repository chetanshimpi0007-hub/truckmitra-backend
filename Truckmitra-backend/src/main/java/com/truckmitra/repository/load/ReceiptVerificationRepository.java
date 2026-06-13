package com.truckmitra.repository.load;

import com.truckmitra.entity.load.ReceiptVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptVerificationRepository extends JpaRepository<ReceiptVerification, Long> {
    List<ReceiptVerification> findByTripId(Long tripId);
    Optional<ReceiptVerification> findFirstByTripIdOrderByCreatedAtDesc(Long tripId);
}
