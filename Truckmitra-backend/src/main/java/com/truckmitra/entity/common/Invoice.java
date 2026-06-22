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

    @Column(name = "invoicenumber", unique = true)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private UserSubscription subscription;

    @Column(name = "planname")
    private String planName;
    private Double amount;
    @Column(name = "gstamount")
    private Double gstAmount;
    
    @Column(name = "gstrate")
    @Builder.Default
    private Double gstRate = 18.0;
    
    @Column(name = "totalamount")
    private Double totalAmount;
    
    @Builder.Default
    private String status = "PENDING"; // PENDING, PAID, CANCELLED
    
    @Column(name = "pdfurl")
    private String pdfUrl;
    
    // Snapshots for historical integrity
    @Column(name = "billinggstnumber")
    private String billingGstNumber;
    @Column(name = "billingaddress")
    private String billingAddress;
    @Column(name = "billinglogourl")
    private String billingLogoUrl;
    
    @Column(name = "billingdate")
    private LocalDate billingDate;
    @Column(name = "duedate")
    private LocalDate dueDate;
    @Column(name = "createdat")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
