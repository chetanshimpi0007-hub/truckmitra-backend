package com.truckmitra.entity.notification;

import jakarta.persistence.Column;
import com.truckmitra.entity.common.BaseEntity;
import com.truckmitra.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "emergency_alerts")
public class EmergencyAlert extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private String status; // ACTIVE, RESOLVED

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
    
    @Column(name = "resolutionnotes")
    private String resolutionNotes;
}
