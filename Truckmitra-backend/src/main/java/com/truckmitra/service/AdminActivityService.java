package com.truckmitra.service;

import com.truckmitra.dto.response.AdminActivityDashboardStatsDto;
import com.truckmitra.entity.AuditLog;
import com.truckmitra.entity.load.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminActivityService {
    AdminActivityDashboardStatsDto getDashboardStats();
    List<AuditLog> getTimeline(int limit);
    Page<Trip> getTripsMaster(String search, Pageable pageable);
}
