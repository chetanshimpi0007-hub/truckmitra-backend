package com.truckmitra.entity.common;

import jakarta.persistence.Column;
import com.truckmitra.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private UserSubscription subscription;

    @Column(name = "plan_name")
    private String planName;
    private Double amount;
    @Column(name = "gst_amount")
    private Double gstAmount;
    
    @Column(name = "gst_rate")
    @Builder.Default
    private Double gstRate = 18.0;
    
    @Column(name = "total_amount")
    private Double totalAmount;
    
    @Builder.Default
    private String status = "PENDING"; // PENDING, PAID, CANCELLED
    
    @Column(name = "pdf_url")
    private String pdfUrl;
    
    // Snapshots for historical integrity
    @Column(name = "billing_gst_number")
    private String billingGstNumber;
    @Column(name = "billing_address")
    private String billingAddress;
    @Column(name = "billing_logo_url")
    private String billingLogoUrl;
    
    @Column(name = "billing_date")
    private LocalDate billingDate;
    @Column(name = "due_date")
    private LocalDate dueDate;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
