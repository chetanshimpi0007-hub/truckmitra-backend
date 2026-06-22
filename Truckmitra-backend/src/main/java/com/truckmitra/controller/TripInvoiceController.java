package com.truckmitra.controller;

import com.truckmitra.dto.response.billing.TripInvoiceDto;
import com.truckmitra.service.TripInvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trip-invoices")
@RequiredArgsConstructor
public class TripInvoiceController {

    private final TripInvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<Page<TripInvoiceDto>> getAllInvoices(Pageable pageable) {
        return ResponseEntity.ok(invoiceService.getAllInvoices(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripInvoiceDto> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<TripInvoiceDto> getInvoiceByTripId(@PathVariable Long tripId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByTripId(tripId));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable Long id) {
        byte[] pdfBytes = invoiceService.generateInvoicePdf(id);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice_" + id + ".pdf");
        
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
