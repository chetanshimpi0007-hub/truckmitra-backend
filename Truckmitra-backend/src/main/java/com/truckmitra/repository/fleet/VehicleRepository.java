package com.truckmitra.repository.fleet;

import com.truckmitra.entity.fleet.Vehicle;
import com.truckmitra.entity.user.Transporter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByTransporter(Transporter transporter);
    List<Vehicle> findByTransporterId(Long transporterId);
    List<Vehicle> findByDriverId(Long driverId);
    long countByTransporterId(Long transporterId);
}
