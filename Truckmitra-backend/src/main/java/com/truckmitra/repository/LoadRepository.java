// src/main/java/com/truckmitra/repository/LoadRepository.java
package com.truckmitra.repository;

import com.truckmitra.entity.common.enums.LoadStatus;
import com.truckmitra.entity.load.Load;
import com.truckmitra.entity.user.Shipper;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoadRepository extends JpaRepository<Load, Long> {
    List<Load> findByShipper(Shipper shipper);
    List<Load> findByTransporterId(Long transporterId);
    List<Load> findByStatus(LoadStatus status);
    List<Load> findByStatusAndIsBiddingEnabled(LoadStatus status, Boolean isBiddingEnabled);
    long countByShipperId(Long shipperId);
    long countByTransporterId(Long transporterId);
}
