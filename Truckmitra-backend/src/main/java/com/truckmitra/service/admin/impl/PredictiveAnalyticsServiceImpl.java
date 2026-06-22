package com.truckmitra.service.admin.impl;

import com.truckmitra.dto.*;
import com.truckmitra.service.admin.PredictiveAnalyticsService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PredictiveAnalyticsServiceImpl implements PredictiveAnalyticsService {

    private final EntityManager entityManager;

    // ─────────────────────────────────────────────────────────────────
    // LOAD VOLUME FORECAST
    // ─────────────────────────────────────────────────────────────────

    @Override
    public LoadForecastDTO forecastLoadVolume() {
        // Fetch last 6 months of load counts
        List<Object[]> raw = safeQuery(
                "SELECT YEAR(l.createdAt), MONTH(l.createdAt), COUNT(l) " +
                "FROM Load l GROUP BY YEAR(l.createdAt), MONTH(l.createdAt) " +
                "ORDER BY YEAR(l.createdAt) DESC, MONTH(l.createdAt) DESC",
                6
        );

        List<Double> values = extractValues(raw, 2);
        List<TrendDTO> trends = buildTrends(raw);

        double currentVolume = values.isEmpty() ? 0 : values.get(0);
        double forecastedVolume = weightedMovingAverage(values);
        double growth = computeGrowth(values);
        double confidence = computeConfidence(values, 6);

        // Peak day / hour
        String peakDay = safeTopString(
                "SELECT DAYNAME(l.createdAt), COUNT(l) FROM Load l " +
                "GROUP BY DAYNAME(l.createdAt) ORDER BY COUNT(l) DESC", 0
        );
        String peakHour = safeTopString(
                "SELECT HOUR(l.createdAt), COUNT(l) FROM Load l " +
                "GROUP BY HOUR(l.createdAt) ORDER BY COUNT(l) DESC", 0
        );
        if (peakHour != null && !peakHour.isEmpty()) {
            try {
                int h = Integer.parseInt(peakHour);
                peakHour = String.format("%02d:00 - %02d:00", h, (h + 1) % 24);
            } catch (NumberFormatException ignored) {}
        }

        return LoadForecastDTO.builder()
                .currentVolume(round(currentVolume))
                .forecastedVolume(round(forecastedVolume))
                .growthPercentage(round(growth))
                .confidencePercentage(round(confidence))
                .peakDay(peakDay != null ? peakDay : "")
                .peakHour(peakHour != null ? peakHour : "")
                .loadTrends(trends)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────
    // REVENUE FORECAST
    // ─────────────────────────────────────────────────────────────────

    @Override
    public RevenueForecastDTO forecastRevenue() {
        List<Object[]> raw = safeQuery(
                "SELECT YEAR(t.createdAt), MONTH(t.createdAt), SUM(t.freightAmount) " +
                "FROM Trip t WHERE t.status = 'COMPLETED' " +
                "GROUP BY YEAR(t.createdAt), MONTH(t.createdAt) " +
                "ORDER BY YEAR(t.createdAt) DESC, MONTH(t.createdAt) DESC",
                6
        );

        List<Double> values = extractValues(raw, 2);
        List<TrendDTO> trends = buildTrends(raw);

        double currentRevenue = values.isEmpty() ? 0 : values.get(0);
        double forecastedRevenue = weightedMovingAverage(values);
        double growth = computeGrowth(values);
        double confidence = computeConfidence(values, 6);

        return RevenueForecastDTO.builder()
                .currentRevenue(round(currentRevenue))
                .forecastedRevenue(round(forecastedRevenue))
                .growthPercentage(round(growth))
                .confidencePercentage(round(confidence))
                .monthlyTrends(trends)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────
    // ROUTE ANALYTICS
    // ─────────────────────────────────────────────────────────────────

    @Override
    public RouteAnalyticsDTO analyzeRoutes() {
        // Top routes by load count
        List<Object[]> topRoutes;
        try {
            topRoutes = entityManager.createQuery(
                    "SELECT l.source, l.destination, COUNT(l), AVG(t.freightAmount) " +
                    "FROM Load l LEFT JOIN Trip t ON t.load.id = l.id " +
                    "WHERE l.source IS NOT NULL AND l.destination IS NOT NULL " +
                    "GROUP BY l.source, l.destination ORDER BY COUNT(l) DESC",
                    Object[].class)
                    .setMaxResults(10)
                    .getResultList();
        } catch (Exception e) {
            log.warn("Route query failed: {}", e.getMessage());
            topRoutes = Collections.emptyList();
        }

        List<PredictionDTO> routePredictions = topRoutes.stream().map(r -> {
            String route = r[0] + " → " + r[1];
            long count = ((Number) r[2]).longValue();
            double avgRevenue = r[3] != null ? ((Number) r[3]).doubleValue() : 0;
            double demandScore = Math.min(100.0, count * 5.0);
            return PredictionDTO.builder()
                    .label(route)
                    .predictedValue(round(demandScore))
                    .confidence(round(Math.min(95.0, 75.0 + count * 1.5)))
                    .unit("demand score")
                    .metadata(Map.of("tripCount", count, "avgRevenue", round(avgRevenue)))
                    .build();
        }).collect(Collectors.toList());

        // Seasonal demand: load count per month across all time
        List<Object[]> seasonal = safeQuery(
                "SELECT MONTH(l.createdAt), COUNT(l) FROM Load l " +
                "GROUP BY MONTH(l.createdAt) ORDER BY MONTH(l.createdAt)",
                12
        );

        Map<String, Double> seasonalDemand = new LinkedHashMap<>();
        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        for (Object[] row : seasonal) {
            int m = ((Number) row[0]).intValue();
            double cnt = ((Number) row[1]).doubleValue();
            if (m >= 1 && m <= 12) seasonalDemand.put(months[m - 1], cnt);
        }

        // Most demanded pickup cities
        List<Object[]> cities = safeQuery(
                "SELECT l.source, COUNT(l) FROM Load l WHERE l.source IS NOT NULL " +
                "GROUP BY l.source ORDER BY COUNT(l) DESC",
                5
        );
        Map<String, Double> demandedCities = new LinkedHashMap<>();
        for (Object[] row : cities) {
            demandedCities.put((String) row[0], ((Number) row[1]).doubleValue());
        }

        String topRoute = routePredictions.isEmpty() ? "" :
                routePredictions.get(0).getLabel();

        return RouteAnalyticsDTO.builder()
                .topRoutes(routePredictions)
                .seasonalDemand(seasonalDemand)
                .mostDemandedCities(demandedCities)
                .topRoute(topRoute)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────
    // UTILIZATION ANALYTICS
    // ─────────────────────────────────────────────────────────────────

    @Override
    public UtilizationDTO analyzeUtilization() {
        // Total vehicles and active ones
        long totalVehicles = safeCount("SELECT COUNT(v) FROM Vehicle v");
        long activeVehicles = safeCount("SELECT COUNT(v) FROM Vehicle v WHERE v.isAvailable = false");

        double activeRate = totalVehicles == 0 ? 0 : (double) activeVehicles / totalVehicles * 100;
        double idleRate = 100 - activeRate;

        // Average trips per vehicle
        long completedTrips = safeCount("SELECT COUNT(t) FROM Trip t WHERE t.status = 'COMPLETED'");
        double avgTrips = totalVehicles == 0 ? 0 : (double) completedTrips / Math.max(1, totalVehicles);

        // Trip completion probability based on last 3 months
        long totalStarted = safeCount("SELECT COUNT(t) FROM Trip t WHERE t.status IN ('IN_TRANSIT', 'COMPLETED', 'DELIVERED')");
        long totalCompleted = safeCount("SELECT COUNT(t) FROM Trip t WHERE t.status IN ('COMPLETED', 'DELIVERED')");
        double completionProb = totalStarted == 0 ? 0.0 :
                round((double) totalCompleted / totalStarted * 100);

        // Late delivery probability (simplified: trips marked delivered after expected)
        long lateTrips = 0;
        try {
            lateTrips = (Long) entityManager.createQuery(
                    "SELECT COUNT(t) FROM Trip t WHERE t.status = 'DELIVERED' " +
                    "AND t.updatedAt > t.load.expectedDeliveryDate"
            ).getSingleResult();
        } catch (Exception e) {
            log.debug("Late delivery calc: {}", e.getMessage());
        }
        double lateProb = totalCompleted == 0 ? 0.0 :
                round((double) lateTrips / Math.max(1, totalCompleted) * 100);

        // Utilization by vehicle type
        List<Object[]> byType = Collections.emptyList();
        try {
            byType = entityManager.createQuery(
                    "SELECT v.vehicleType, COUNT(v), SUM(CASE WHEN v.isAvailable = false THEN 1 ELSE 0 END) " +
                    "FROM Vehicle v GROUP BY v.vehicleType",
                    Object[].class
            ).getResultList();
        } catch (Exception e) {
            log.warn("Vehicle type query: {}", e.getMessage());
        }

        Map<String, Double> utilizationByType = new LinkedHashMap<>();
        String topType = "";
        double topTypeRate = 0;
        for (Object[] row : byType) {
            String type = (String) row[0];
            long total = ((Number) row[1]).longValue();
            long active = row[2] != null ? ((Number) row[2]).longValue() : 0;
            double rate = total == 0 ? 0 : round((double) active / total * 100);
            utilizationByType.put(type, rate);
            if (rate > topTypeRate) {
                topTypeRate = rate;
                topType = type;
            }
        }

        // Weekly trend: trips per week for last 8 weeks
        List<Object[]> weeklyRaw = safeQuery(
                "SELECT WEEK(t.createdAt), COUNT(t) FROM Trip t " +
                "WHERE t.createdAt >= DATE_SUB(NOW(), INTERVAL 8 WEEK) " +
                "GROUP BY WEEK(t.createdAt) ORDER BY WEEK(t.createdAt) DESC",
                8
        );

        List<TrendDTO> weeklyTrends = weeklyRaw.stream().map(r -> TrendDTO.builder()
                .period("Week " + r[0])
                .value(((Number) r[1]).doubleValue())
                .change(0.0)
                .build()
        ).collect(Collectors.toList());

        // Predict next utilization using WMA on last 4 weeks
        List<Double> weekVals = weeklyTrends.stream()
                .map(TrendDTO::getValue).collect(Collectors.toList());
        double predictedUtil = totalVehicles == 0 ? activeRate :
                Math.min(100, round(weightedMovingAverage(weekVals) / Math.max(1, totalVehicles) * 100));

        return UtilizationDTO.builder()
                .overallUtilizationRate(round(activeRate))
                .activeVehiclePercentage(round(activeRate))
                .idleVehiclePercentage(round(idleRate))
                .averageTripsPerVehicle(round(avgTrips))
                .predictedUtilizationRate(round(predictedUtil))
                .utilizationByVehicleType(utilizationByType)
                .weeklyTrends(weeklyTrends)
                .topPerformingVehicleType(topType)
                .tripCompletionProbability(round(completionProb))
                .lateDeliveryProbability(round(lateProb))
                .build();
    }

    // ─────────────────────────────────────────────────────────────────
    // FORECASTING ALGORITHMS
    // ─────────────────────────────────────────────────────────────────

    /**
     * Weighted Moving Average: recent values carry more weight.
     * Weights: [1, 2, 3, 4, 5, 6] for oldest→newest
     */
    private double weightedMovingAverage(List<Double> values) {
        if (values == null || values.isEmpty()) return 0;
        // values[0] = most recent; reverse for WMA
        List<Double> ordered = new ArrayList<>(values);
        Collections.reverse(ordered); // oldest first
        int n = ordered.size();
        double weightedSum = 0;
        double weightTotal = 0;
        for (int i = 0; i < n; i++) {
            double weight = i + 1;
            weightedSum += ordered.get(i) * weight;
            weightTotal += weight;
        }
        double wma = weightTotal == 0 ? 0 : weightedSum / weightTotal;
        // Project next period: apply trend from last 2 points
        if (n >= 2) {
            double trend = ordered.get(n - 1) - ordered.get(n - 2);
            wma = wma + trend * 0.5; // conservative projection
        }
        return Math.max(0, wma);
    }

    /**
     * Compute month-over-month growth percentage.
     */
    private double computeGrowth(List<Double> values) {
        if (values == null || values.size() < 2) return 0;
        double current = values.get(0);
        double previous = values.get(1);
        if (previous == 0) return current > 0 ? 100.0 : 0;
        return ((current - previous) / previous) * 100;
    }

    /**
     * Confidence: based on data completeness (max 6 months).
     * More data = higher confidence. Base 60% + 6.67% per data point.
     */
    private double computeConfidence(List<Double> values, int maxPoints) {
        if (values == null || values.isEmpty()) return 0.0;
        double increment = 100.0 / maxPoints;
        return Math.min(100.0, values.size() * increment);
    }

    // ─────────────────────────────────────────────────────────────────
    // HELPER UTILITIES
    // ─────────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private List<Object[]> safeQuery(String jpql, int maxResults) {
        try {
            return entityManager.createQuery(jpql, Object[].class)
                    .setMaxResults(maxResults)
                    .getResultList();
        } catch (Exception e) {
            log.warn("Query failed [{}]: {}", jpql.substring(0, Math.min(60, jpql.length())), e.getMessage());
            return Collections.emptyList();
        }
    }

    private long safeCount(String jpql) {
        try {
            Object result = entityManager.createQuery(jpql).getSingleResult();
            return result != null ? ((Number) result).longValue() : 0L;
        } catch (Exception e) {
            log.debug("Count query failed: {}", e.getMessage());
            return 0L;
        }
    }

    private String safeTopString(String jpql, int colIndex) {
        try {
            List<Object[]> rows = entityManager.createQuery(jpql, Object[].class)
                    .setMaxResults(1).getResultList();
            if (!rows.isEmpty() && rows.get(0)[colIndex] != null) {
                return rows.get(0)[colIndex].toString();
            }
        } catch (Exception e) {
            log.debug("Top string query: {}", e.getMessage());
        }
        return null;
    }

    private List<Double> extractValues(List<Object[]> rows, int colIndex) {
        return rows.stream()
                .map(r -> r[colIndex] != null ? ((Number) r[colIndex]).doubleValue() : 0.0)
                .collect(Collectors.toList());
    }

    private List<TrendDTO> buildTrends(List<Object[]> rows) {
        List<TrendDTO> result = new ArrayList<>();
        for (int i = 0; i < rows.size(); i++) {
            Object[] r = rows.get(i);
            double value = r[2] != null ? ((Number) r[2]).doubleValue() : 0;
            double prevValue = (i + 1 < rows.size() && rows.get(i + 1)[2] != null)
                    ? ((Number) rows.get(i + 1)[2]).doubleValue() : value;
            double change = prevValue == 0 ? 0 : ((value - prevValue) / prevValue) * 100;
            result.add(TrendDTO.builder()
                    .period(getMonthName(((Number) r[1]).intValue()) + " " + r[0])
                    .value(round(value))
                    .change(round(change))
                    .build());
        }
        return result;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private String getMonthName(int month) {
        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        return (month >= 1 && month <= 12) ? months[month - 1] : "";
    }
}
