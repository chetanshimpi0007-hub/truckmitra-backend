// src/main/java/com/truckmitra/repository/user/DriverRepository.java
package com.truckmitra.repository.user;

import com.truckmitra.entity.user.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findByMobile(String mobile);

    Optional<Driver> findByDrivingLicenseNumber(String licenseNumber);

    @Query("SELECT d FROM Driver d WHERE d.transporterId = :transporterId AND d.isAvailable = true")
    List<Driver> findAvailableDriversByTransporter(@Param("transporterId") Long transporterId);

    @Query("SELECT d FROM Driver d WHERE d.isAvailable = true AND d.isOnTrip = false")
    Page<Driver> findAvailableDrivers(Pageable pageable);

    @Modifying
    @Query("UPDATE Driver d SET d.currentLatitude = :lat, d.currentLongitude = :lng, " +
           "d.lastLocationUpdate = CURRENT_TIMESTAMP WHERE d.id = :driverId")
    void updateDriverLocation(@Param("driverId") Long driverId, 
                              @Param("lat") Double latitude, 
                              @Param("lng") Double longitude);

    @Query("SELECT COUNT(d) FROM Driver d WHERE d.transporterId = :transporterId")
    long countByTransporterId(@Param("transporterId") Long transporterId);
}