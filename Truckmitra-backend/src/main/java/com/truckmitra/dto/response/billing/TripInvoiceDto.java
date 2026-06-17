package com.truckmitra.dto.response.billing;

import com.truckmitra.entity.common.enums.InvoicePaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripInvoiceDto {
    private Long id;
    private String invoiceNumber;
    private String tripNumber;
    private Long loadId;
    private String shipperName;
    private String transporterName;
    private String driverName;
    private String vehicleNumber;
    private String source;
    private String destination;
    
    private Double totalAmount;
    private Double paidAmount;
    private Double pendingAmount;
    
    private InvoicePaymentStatus status;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private String pdfUrl;
    private LocalDateTime createdAt;
}
