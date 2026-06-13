// src/main/java/com/truckmitra/repository/user/ShipperRepository.java
package com.truckmitra.repository.user;

import com.truckmitra.entity.user.Shipper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShipperRepository extends JpaRepository<Shipper, Long> {

    Optional<Shipper> findByMobile(String mobile);

    Optional<Shipper> findByGstNumber(String gstNumber);

    @Modifying
    @Query("UPDATE Shipper s SET s.freeLoadsRemaining = s.freeLoadsRemaining - 1 WHERE s.id = :shipperId AND s.freeLoadsRemaining > 0")
    int useFreeLoad(@Param("shipperId") Long shipperId);

    @Modifying
    @Query("UPDATE Shipper s SET s.totalLoadsPosted = s.totalLoadsPosted + 1, " +
           "s.activeLoads = s.activeLoads + 1 WHERE s.id = :shipperId")
    void incrementLoadStats(@Param("shipperId") Long shipperId);
}