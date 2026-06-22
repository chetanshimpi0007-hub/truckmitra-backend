package com.truckmitra.entity.load;

import jakarta.persistence.Column;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "proof_of_delivery")
public class ProofOfDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "signature_url")
    private String signatureUrl;
    
    @Column(length = 1000)
    private String remarks;
    
    @Column(name = "uploaded_at")
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
    
    @Column(name = "pod_reference_number")
    private String podReferenceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private com.truckmitra.entity.user.User uploadedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private com.truckmitra.entity.user.User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rejected_by")
    private com.truckmitra.entity.user.User rejectedBy;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;
}
