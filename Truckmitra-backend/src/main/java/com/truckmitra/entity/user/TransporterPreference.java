package com.truckmitra.entity.user;

import com.truckmitra.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transporter_preferences", indexes = {
    @Index(name = "idx_pref_transporter", columnList = "transporter_id")
})
public class TransporterPreference extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transporter_id", nullable = false, unique = true)
    private Long transporterId;

    @Column(name = "preferred_pickup_cities", length = 1000)
    private String preferredPickupCities; // comma-separated

    @Column(name = "preferred_destination_cities", length = 1000)
    private String preferredDestinationCities; // comma-separated

    @Column(name = "vehicle_types", length = 1000)
    private String vehicleTypes; // comma-separated

    @Column(name = "min_weight")
    private Double minWeight;

    @Column(name = "max_weight")
    private Double maxWeight;

    @Column(name = "preferred_routes", length = 1000)
    private String preferredRoutes; // comma-separated, e.g. "Delhi-Mumbai,Mumbai-Pune"

    @Column(name = "max_distance_radius")
    private Double maxDistanceRadius;

    @Column(name = "preferred_trip_frequency")
    private Integer preferredTripFrequency; // e.g. trips per month preferred

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;
}
