package com.truckmitra.service.user;

import com.truckmitra.dto.response.DriverAvailabilitySummaryResponse;
import com.truckmitra.entity.user.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DriverAvailabilityService {

    DriverAvailabilitySummaryResponse getAvailabilitySummary(Long transporterId);

    Page<Driver> getAvailableDrivers(Long transporterId, String city, String vehicleType, Pageable pageable);
}
