package com.truckmitra.service.admin;

import com.truckmitra.entity.user.User;
import java.util.Map;

public interface ReportService {
    byte[] generateRevenueReport(String format, String startDate, String endDate);
    byte[] generateFleetReport(String format, Long transporterId);
    byte[] generateLoadReport(String format, String status);
    byte[] generateDriverPerformanceReport(String format, Long transporterId);
}
