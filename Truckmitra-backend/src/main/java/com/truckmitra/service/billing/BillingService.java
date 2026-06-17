package com.truckmitra.service.billing;

import com.truckmitra.dto.response.billing.BillingSummaryDto;
import com.truckmitra.dto.response.billing.PaymentRecordDto;
import com.truckmitra.dto.response.billing.TripInvoiceDto;
import com.truckmitra.entity.billing.TripInvoice;
import com.truckmitra.entity.load.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BillingService {
    
    // Auto-generation
    TripInvoice generateInvoiceForTrip(Trip trip);
    
    // Retrieval & Search
    Page<TripInvoiceDto> searchInvoices(String search, Long driverId, Long transporterId, Long shipperId, String status, Pageable pageable);
    
    TripInvoiceDto getInvoiceDetails(Long id);
    
    // Dashboards
    BillingSummaryDto getAdminBillingSummary();
    BillingSummaryDto getDriverBillingSummary(Long driverId);
    BillingSummaryDto getTransporterBillingSummary(Long transporterId);
    BillingSummaryDto getShipperBillingSummary(Long shipperId);
    
    // Payment Processing
    PaymentRecordDto recordPayment(Long invoiceId, Double amount, String paymentMethod, String transactionId, String remarks);
    
    // History
    List<PaymentRecordDto> getPaymentHistory(Long invoiceId);
    
    // Exports
    byte[] exportInvoicesToExcel(String search, Long driverId, Long transporterId, Long shipperId, String status);
}
