package com.truckmitra.service.admin;

import com.truckmitra.dto.*;

public interface PredictiveAnalyticsService {
    LoadForecastDTO forecastLoadVolume();
    RevenueForecastDTO forecastRevenue();
    RouteAnalyticsDTO analyzeRoutes();
    UtilizationDTO analyzeUtilization();
}
