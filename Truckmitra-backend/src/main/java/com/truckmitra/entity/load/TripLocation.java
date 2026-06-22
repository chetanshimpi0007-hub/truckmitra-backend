package com.truckmitra.entity.load;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trip_locations", indexes = {
    @Index(name = "idx_trip_locations_trip_id", columnList = "trip_id"),
    @Index(name = "idx_trip_locations_timestamp", columnList = "timestamp")
})
public class TripLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    // Driver reference (denormalized for quick queries)
    @Column(name = "driver_id")
    private Long driverId;

    private Double latitude;
    private Double longitude;
    private Double speed;       // km/h
    private Double heading;     // degrees 0-360
    private Double accuracy;    // metres

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
