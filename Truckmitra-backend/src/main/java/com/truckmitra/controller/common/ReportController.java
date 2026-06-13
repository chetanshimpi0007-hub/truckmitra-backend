package com.truckmitra.controller.common;

import com.truckmitra.service.common.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/trips/csv")
    public ResponseEntity<byte[]> exportTripsCsv(@RequestBody List<Long> tripIds) {
        byte[] data = reportService.generateTripsReportCsv(tripIds);
        return createResponse(data, "trips_report.csv", "text/csv");
    }

    @PostMapping("/invoices/csv")
    public ResponseEntity<byte[]> exportInvoicesCsv(@RequestBody List<Long> invoiceIds) {
        byte[] data = reportService.generateInvoicesReportCsv(invoiceIds);
        return createResponse(data, "invoices_report.csv", "text/csv");
    }

    private ResponseEntity<byte[]> createResponse(byte[] data, String filename, String contentType) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType(contentType))
                .body(data);
    }
}
