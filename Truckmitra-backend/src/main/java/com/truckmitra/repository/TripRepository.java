package com.truckmitra.repository;

import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.common.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TripRepository extends JpaRepository<Trip, Long>, JpaSpecificationExecutor<Trip> {

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"load", "bid", "shipper", "transporter"})
    List<Trip> findByDriverId(Long driverId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"load", "bid", "shipper", "transporter"})
    List<Trip> findByLoad_TransporterId(Long transporterId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"load", "bid", "shipper", "transporter"})
    List<Trip> findByStatusIn(List<TripStatus> statuses);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"load", "bid", "shipper", "transporter"})
    List<Trip> findByLoad_ShipperIdAndStatusIn(
            Long shipperId,
            List<TripStatus> statuses
    );

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"load", "bid", "shipper", "transporter"})
    java.util.Optional<Trip> findByLoadId(Long loadId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"load", "bid", "shipper", "transporter"})
    List<Trip> findByTransporterId(Long transporterId);
    
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"load", "bid", "shipper", "transporter"})
    List<Trip> findByShipperId(Long shipperId);

    long countByShipperId(Long shipperId);
    long countByTransporterId(Long transporterId);

    @org.springframework.data.jpa.repository.Query("SELECT t FROM Trip t WHERE t.driver.id = :userId OR t.transporter.id = :userId OR t.load.shipper.id = :userId")
    org.springframework.data.domain.Page<Trip> findAllTripsByUserId(@org.springframework.data.repository.query.Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT t FROM Trip t WHERE (t.driver.id = :userId OR t.transporter.id = :userId OR t.load.shipper.id = :userId) AND t.finalInvoicePdfUrl IS NOT NULL AND t.status = 'COMPLETED'")
    org.springframework.data.domain.Page<Trip> findInvoicesByUserId(@org.springframework.data.repository.query.Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);
}