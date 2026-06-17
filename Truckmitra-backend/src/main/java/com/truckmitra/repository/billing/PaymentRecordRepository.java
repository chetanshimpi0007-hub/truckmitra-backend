package com.truckmitra.repository.billing;

import com.truckmitra.entity.billing.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
    List<PaymentRecord> findByTripInvoiceIdOrderByPaymentDateDesc(Long tripInvoiceId);
}
