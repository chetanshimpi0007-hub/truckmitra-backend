package com.truckmitra.entity.common;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "enterprise_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "setting_key", nullable = false, unique = true)
    private String settingKey; // GLOBAL_PLATFORM, or specific company key

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_logo")
    private String companyLogo;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "company_address")
    private String companyAddress;

    @Column(name = "invoice_prefix")
    private String invoicePrefix;

    @Column(name = "theme_colors")
    private String themeColors; // Store as JSON string

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
