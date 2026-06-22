package com.truckmitra.entity.common;

import jakarta.persistence.Column;
import com.truckmitra.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "billing_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "companyname")
    private String companyName;
    @Column(name = "gstnumber")
    private String gstNumber;
    @Column(name = "companyaddress")
    private String companyAddress;
    
    @Column(name = "invoiceprefix")
    @Builder.Default
    private String invoicePrefix = "TM";
    
    @Column(name = "themecolors")
    private String themeColors; // JSON string for white-label
    @Column(name = "logourl")
    private String logoUrl;

    @Column(name = "createdat")
    private LocalDateTime createdAt;
    @Column(name = "updatedat")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
