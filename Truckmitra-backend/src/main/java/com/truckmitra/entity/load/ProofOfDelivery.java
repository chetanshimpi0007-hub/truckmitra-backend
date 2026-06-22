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

    @Column(name = "imageurl")
    private String imageUrl;
    @Column(name = "signatureurl")
    private String signatureUrl;
    
    @Column(length = 1000)
    private String remarks;
    
    @Column(name = "uploadedat")
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
    
    @Column(name = "podreferencenumber")
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
