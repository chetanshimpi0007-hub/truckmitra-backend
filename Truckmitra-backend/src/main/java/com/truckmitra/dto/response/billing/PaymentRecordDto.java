package com.truckmitra.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRecordDto {
    private Long id;
    private Long tripInvoiceId;
    private String invoiceNumber;
    private Double amountPaid;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String transactionId;
    private String remarks;
}
