package com.truckmitra.controller.billing;

import com.truckmitra.dto.response.billing.BillingSummaryDto;
import com.truckmitra.dto.response.billing.PaymentRecordDto;
import com.truckmitra.dto.response.billing.TripInvoiceDto;
import com.truckmitra.security.SecurityUtils;
import com.truckmitra.service.billing.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TripInvoiceDto>> getAllInvoices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(billingService.searchInvoices(search, null, null, null, status, PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripInvoiceDto> getInvoiceDetails(@PathVariable Long id) {
        // Additional security could be added here to ensure user owns the invoice
        return ResponseEntity.ok(billingService.getInvoiceDetails(id));
    }

    @GetMapping("/driver")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Page<TripInvoiceDto>> getDriverInvoices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long driverId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(billingService.searchInvoices(search, driverId, null, null, status, PageRequest.of(page, size)));
    }

    @GetMapping("/transporter")
    @PreAuthorize("hasRole('TRANSPORTER')")
    public ResponseEntity<Page<TripInvoiceDto>> getTransporterInvoices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long transporterId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(billingService.searchInvoices(search, null, transporterId, null, status, PageRequest.of(page, size)));
    }

    @GetMapping("/shipper")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<Page<TripInvoiceDto>> getShipperInvoices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long shipperId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(billingService.searchInvoices(search, null, null, shipperId, status, PageRequest.of(page, size)));
    }

    @GetMapping("/admin-summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BillingSummaryDto> getAdminSummary() {
        return ResponseEntity.ok(billingService.getAdminBillingSummary());
    }

    @GetMapping("/summary")
    public ResponseEntity<BillingSummaryDto> getMySummary() {
        Long userId = SecurityUtils.getCurrentUserId();
        java.util.Set<String> roles = SecurityUtils.getCurrentUserRoles();
        if (roles.contains("ROLE_DRIVER")) {
            return ResponseEntity.ok(billingService.getDriverBillingSummary(userId));
        } else if (roles.contains("ROLE_TRANSPORTER")) {
            return ResponseEntity.ok(billingService.getTransporterBillingSummary(userId));
        } else if (roles.contains("ROLE_SHIPPER")) {
            return ResponseEntity.ok(billingService.getShipperBillingSummary(userId));
        } else if (roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.ok(billingService.getAdminBillingSummary());
        }
        throw new RuntimeException("Role not authorized for summary");
    }

    @PostMapping("/{id}/payments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentRecordDto> recordPayment(
            @PathVariable Long id,
            @RequestParam Double amount,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String transactionId,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(billingService.recordPayment(id, amount, paymentMethod, transactionId, remarks));
    }

    @GetMapping("/{id}/payments")
    public ResponseEntity<List<PaymentRecordDto>> getPaymentHistory(@PathVariable Long id) {
        return ResponseEntity.ok(billingService.getPaymentHistory(id));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportInvoices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        
        Long driverId = null, transporterId = null, shipperId = null;
        java.util.Set<String> roles = SecurityUtils.getCurrentUserRoles();
        Long userId = SecurityUtils.getCurrentUserId();
        
        if (roles.contains("ROLE_DRIVER")) {
            driverId = userId;
        } else if (roles.contains("ROLE_TRANSPORTER")) {
            transporterId = userId;
        } else if (roles.contains("ROLE_SHIPPER")) {
            shipperId = userId;
        } else if (!roles.contains("ROLE_ADMIN")) {
            throw new RuntimeException("Role not authorized for export");
        }
        
        byte[] csvBytes = billingService.exportInvoicesToExcel(search, driverId, transporterId, shipperId, status);
        
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoices.csv");
        headers.setContentType(org.springframework.http.MediaType.parseMediaType("text/csv"));
        
        return new ResponseEntity<>(csvBytes, headers, org.springframework.http.HttpStatus.OK);
    }
}
