package com.truckmitra.entity.load;

import jakarta.persistence.Column;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "lorry_receipts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LorryReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lr_number", unique = true, nullable = false)
    private String lrNumber;

    @Column(name = "qr_code_url")
    private String qrCodeUrl;

    @Column(name = "pdf_url")
    private String pdfUrl;

    // Suppress full Trip serialization to avoid circular reference and LazyInitializationException.
    // The frontend only needs trip.id, trip.source, trip.destination for display.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler",
        "load", "bid", "shipper", "transporter", "vehicle", "driver",
        "pickupReceiptUrl", "deliveryReceiptUrl", "podUrl", "podSignatureUrl",
        "assignmentPdfUrl", "finalInvoicePdfUrl", "tripPdfUrl",
        "locationEnabled", "currentLat", "currentLng", "lastLocationUpdate",
        "startedAt", "completedAt", "rejectionReason"})
    private Trip trip;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
