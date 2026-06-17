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

    @Query("SELECT d FROM Driver d WHERE d.transporterId = :transporterId AND d.availabilityStatus = 'AVAILABLE'")
    List<Driver> findAvailableDriversByTransporter(@Param("transporterId") Long transporterId);

    @Query("SELECT d FROM Driver d WHERE d.availabilityStatus = 'AVAILABLE'")
    Page<Driver> findAvailableDrivers(Pageable pageable);

    @Query("SELECT d FROM Driver d WHERE d.availabilityStatus = 'AVAILABLE' AND d.city = :city")
    Page<Driver> findAvailableDriversByCity(@Param("city") String city, Pageable pageable);

    @Query("SELECT d.city, COUNT(d) FROM Driver d WHERE d.availabilityStatus = 'AVAILABLE' AND d.transporterId = :transporterId AND d.city IS NOT NULL GROUP BY d.city")
    List<Object[]> countAvailableDriversByCityForTransporter(@Param("transporterId") Long transporterId);

    @Query("SELECT d.availabilityStatus, COUNT(d) FROM Driver d WHERE d.transporterId = :transporterId GROUP BY d.availabilityStatus")
    List<Object[]> countDriverStatusesForTransporter(@Param("transporterId") Long transporterId);

    @Modifying
    @Query("UPDATE Driver d SET d.currentLatitude = :lat, d.currentLongitude = :lng, " +
           "d.lastLocationUpdate = CURRENT_TIMESTAMP WHERE d.id = :driverId")
    void updateDriverLocation(@Param("driverId") Long driverId, 
                              @Param("lat") Double latitude, 
                              @Param("lng") Double longitude);

    @Query("SELECT COUNT(d) FROM Driver d WHERE d.transporterId = :transporterId")
    long countByTransporterId(@Param("transporterId") Long transporterId);
}