package com.truckmitra.repository.common;

import com.truckmitra.entity.common.Invoice;
import com.truckmitra.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUser(User user);
    java.util.Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
}
