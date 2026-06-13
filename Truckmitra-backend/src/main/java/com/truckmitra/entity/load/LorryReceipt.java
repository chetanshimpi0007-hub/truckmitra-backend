package com.truckmitra.entity.load;

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

    @Column(unique = true, nullable = false)
    private String lrNumber;

    private String qrCodeUrl;

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

    private LocalDateTime generatedAt;

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
