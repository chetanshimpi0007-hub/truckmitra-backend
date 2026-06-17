package com.truckmitra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminActivityDashboardStatsDto {
    private long totalLoads;
    private long totalTrips;
    private long activeTrips;
    private long completedTrips;
    private long pendingPod;
    private long availableDrivers;
    private long driversOnTrip;
    private long approvedUsers;
    private long pendingUsers;
}
