package com.truckmitra.entity.common;

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

    @Column(unique = true)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private UserSubscription subscription;

    private String planName;
    private Double amount;
    private Double gstAmount;
    
    @Builder.Default
    private Double gstRate = 18.0;
    
    private Double totalAmount;
    
    @Builder.Default
    private String status = "PENDING"; // PENDING, PAID, CANCELLED
    
    private String pdfUrl;
    
    // Snapshots for historical integrity
    private String billingGstNumber;
    private String billingAddress;
    private String billingLogoUrl;
    
    private LocalDate billingDate;
    private LocalDate dueDate;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
