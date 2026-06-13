package com.truckmitra.service;

import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> getAdminAnalytics();
    Map<String, Object> getShipperAnalytics(Long userId);
    Map<String, Object> getTransporterAnalytics(Long userId);
}
