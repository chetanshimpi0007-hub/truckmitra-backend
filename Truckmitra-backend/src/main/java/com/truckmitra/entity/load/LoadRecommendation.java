package com.truckmitra.entity.load;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "load_recommendations", indexes = {
    @Index(name = "idx_rec_load", columnList = "load_id"),
    @Index(name = "idx_rec_transporter", columnList = "transporter_id"),
    @Index(name = "idx_rec_score", columnList = "match_score")
})
public class LoadRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "load_id", nullable = false)
    private Long loadId;

    @Column(name = "transporter_id", nullable = false)
    private Long transporterId;

    @Column(name = "match_score", nullable = false)
    private Double matchScore;

    @Column(name = "confidence_percentage", nullable = false)
    private Double confidencePercentage;

    @Column(name = "recommendation_reason", length = 1000)
    private String recommendationReason; // Comma separated list of matched factors, or description

    @Column(name = "status", nullable = false, length = 50)
    private String status; // "PENDING", "ACCEPTED", "REJECTED", "DISMISSED"

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}
