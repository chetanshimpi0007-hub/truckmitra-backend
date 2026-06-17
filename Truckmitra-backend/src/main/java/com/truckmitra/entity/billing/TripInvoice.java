package com.truckmitra.entity.billing;

import com.truckmitra.entity.common.enums.InvoicePaymentStatus;
import com.truckmitra.entity.load.Trip;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_invoices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    // We store denormalized financial amounts to preserve history in case Trip amounts change
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "paid_amount", nullable = false)
    @Builder.Default
    private Double paidAmount = 0.0;

    @Column(name = "pending_amount", nullable = false)
    private Double pendingAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InvoicePaymentStatus status = InvoicePaymentStatus.PENDING;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (pendingAmount == null) {
            pendingAmount = totalAmount - paidAmount;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (totalAmount != null && paidAmount != null) {
            pendingAmount = totalAmount - paidAmount;
            
            if (pendingAmount <= 0) {
                status = InvoicePaymentStatus.PAID;
                pendingAmount = 0.0;
            } else if (paidAmount > 0) {
                if (dueDate != null && LocalDate.now().isAfter(dueDate)) {
                    status = InvoicePaymentStatus.OVERDUE;
                } else {
                    status = InvoicePaymentStatus.PARTIALLY_PAID;
                }
            } else if (dueDate != null && LocalDate.now().isAfter(dueDate)) {
                status = InvoicePaymentStatus.OVERDUE;
            } else {
                status = InvoicePaymentStatus.PENDING;
            }
        }
    }
}
