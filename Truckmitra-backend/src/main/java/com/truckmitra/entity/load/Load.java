// src/main/java/com/truckmitra/entity/load/Load.java
package com.truckmitra.entity.load;

import com.truckmitra.entity.common.BaseEntity;
import com.truckmitra.entity.common.enums.LoadStatus;
import com.truckmitra.entity.user.Shipper;
import com.truckmitra.entity.user.Transporter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "loads")
@SQLDelete(sql = "UPDATE loads SET is_deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "is_deleted = false")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "bids", "shipper", "transporter"})
public class Load extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private Double weight; // in tons

    private String materialType;

    @Column(length = 500)
    private String description;

    private LocalDateTime pickupDate;

    private BigDecimal budget;

    @Enumerated(EnumType.STRING)
    private LoadStatus status;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipper_id")
    private Shipper shipper;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporter_id")
    private Transporter transporter;

    @com.fasterxml.jackson.annotation.JsonProperty("isBiddingEnabled")
    private Boolean isBiddingEnabled;

    @ToString.Exclude
    @OneToMany(mappedBy = "load", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.List<Bid> bids = new java.util.ArrayList<>();
}
