package com.truckmitra.service.common;

import java.util.List;

public interface ReportService {
    byte[] generateTripsReportCsv(List<Long> tripIds);
    byte[] generateInvoicesReportCsv(List<Long> invoiceIds);
    byte[] generateSubscriptionReportCsv();
    
    // PDF versions are already in PdfService, but we can wrap them here if needed
}
