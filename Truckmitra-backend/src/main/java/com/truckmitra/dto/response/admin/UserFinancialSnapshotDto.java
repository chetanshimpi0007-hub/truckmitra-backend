package com.truckmitra.dto.response.admin;

import com.truckmitra.dto.response.billing.PaymentRecordDto;
import com.truckmitra.dto.response.billing.TripInvoiceDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserFinancialSnapshotDto {
    // User Profile Data
    private Long userId;
    private String fullName;
    private String role;
    private String mobile;
    private String email;
    private String companyName;
    private String registrationDate;
    private String status;
    private String approvalStatus;

    // Financial Metrics
    private Double totalRevenue;
    private Double totalPaid;
    private Double pendingBalance;
    private Integer totalTrips;
    private Integer completedTrips;
    private Integer activeTrips;

    // Lists
    private List<TripInvoiceDto> recentInvoices;
    private List<PaymentRecordDto> recentPayments;
}
