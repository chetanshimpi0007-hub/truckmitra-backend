package com.truckmitra.repository.billing;

import com.truckmitra.entity.billing.TripInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripInvoiceRepository extends JpaRepository<TripInvoice, Long>, JpaSpecificationExecutor<TripInvoice> {
    Optional<TripInvoice> findByInvoiceNumber(String invoiceNumber);
    Optional<TripInvoice> findByTripId(Long tripId);
}
