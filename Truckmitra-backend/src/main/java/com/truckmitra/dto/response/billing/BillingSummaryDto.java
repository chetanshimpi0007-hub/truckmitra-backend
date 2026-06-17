package com.truckmitra.dto.response.billing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingSummaryDto {
    private Double totalRevenue;
    private Double totalPaid;
    private Double totalPending;
    private Double totalOverdue;
    
    // Admin specific
    private Long totalInvoices;
    private Long pendingInvoicesCount;
    private Long overdueInvoicesCount;
}
