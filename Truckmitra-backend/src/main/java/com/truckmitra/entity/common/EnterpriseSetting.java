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

    @Column(nullable = false, unique = true)
    private String settingKey; // GLOBAL_PLATFORM, or specific company key

    private String companyName;
    private String companyLogo;
    private String gstNumber;
    private String companyAddress;
    private String invoicePrefix;
    private String themeColors; // Store as JSON string

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
