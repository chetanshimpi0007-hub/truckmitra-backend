// src/main/java/com/truckmitra/repository/user/TransporterRepository.java
package com.truckmitra.repository.user;

import com.truckmitra.entity.user.Transporter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransporterRepository extends JpaRepository<Transporter, Long> {

    Optional<Transporter> findByMobile(String mobile);

    Optional<Transporter> findByAgencyName(String agencyName);

    @Modifying
    @Query("UPDATE Transporter t SET t.freeBidsRemaining = t.freeBidsRemaining - 1 WHERE t.id = :transporterId AND t.freeBidsRemaining > 0")
    int useFreeBid(@Param("transporterId") Long transporterId);

    @Modifying
    @Query("UPDATE Transporter t SET t.totalDrivers = t.totalDrivers + 1 WHERE t.id = :transporterId")
    void incrementDriverCount(@Param("transporterId") Long transporterId);

    @Modifying
    @Query("UPDATE Transporter t SET t.totalVehicles = t.totalVehicles + 1 WHERE t.id = :transporterId")
    void incrementVehicleCount(@Param("transporterId") Long transporterId);
}