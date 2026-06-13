package com.truckmitra.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

@RestController
public class TestQueryController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/api/test-bcrypt")
    public String testBcrypt() {
        String hash = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("snehal@123");
        jdbcTemplate.update("UPDATE users SET password = ? WHERE id = 7", hash);
        return "Updated password hash for driver 7: " + hash;
    }

    @GetMapping("/api/test-db")
    public Map<String, Object> testDb() {
        // 1. Verify drivers
        jdbcTemplate.update("UPDATE users SET accountStatus = 'VERIFIED' WHERE role = 'DRIVER'");

        // 2. Ensure subscription_plans table exists
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS subscription_plans (" +
                "id SERIAL PRIMARY KEY, name VARCHAR(50) UNIQUE, description VARCHAR(255), price DOUBLE PRECISION, " +
                "loadpostlimit INT, bidlimit INT, fleetlimit INT, hasanalytics BOOLEAN, hasvoiceassistant BOOLEAN)");
        
        // Seed PRO plan safely
        List<Map<String, Object>> existing = jdbcTemplate.queryForList("SELECT id FROM subscription_plans WHERE name = ?", "PRO");
        Long proPlanId;
        if (existing.isEmpty()) {
            jdbcTemplate.update("INSERT INTO subscription_plans (name, description, price, loadpostlimit, bidlimit, fleetlimit, hasanalytics, hasvoiceassistant) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    "PRO", "Advanced features for enterprise logistics", 4999.0, -1, -1, -1, true, true);
            proPlanId = jdbcTemplate.queryForObject("SELECT id FROM subscription_plans WHERE name = ?", Long.class, "PRO");
        } else {
            proPlanId = ((Number) existing.get(0).get("id")).longValue();
        }

        // 3. Ensure user_subscriptions table exists
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS user_subscriptions (" +
                "id SERIAL PRIMARY KEY, user_id BIGINT UNIQUE, plan_id BIGINT, startdate TIMESTAMP, enddate TIMESTAMP, autorenew BOOLEAN, status VARCHAR(20))");

        // 4. Subscribe all transporters to the PRO plan
        List<Map<String, Object>> transporters = jdbcTemplate.queryForList("SELECT id FROM users WHERE role = 'TRANSPORTER'");
        
        java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());
        java.sql.Timestamp nextMonth = new java.sql.Timestamp(System.currentTimeMillis() + 30L * 24L * 60L * 60L * 1000L);

        for (Map<String, Object> transporter : transporters) {
            Long userId = ((Number) transporter.get("id")).longValue();
            List<Map<String, Object>> subExists = jdbcTemplate.queryForList("SELECT id FROM user_subscriptions WHERE user_id = ?", userId);
            if (subExists.isEmpty()) {
                jdbcTemplate.update("INSERT INTO user_subscriptions (user_id, plan_id, startdate, enddate, autorenew, status) VALUES (?, ?, ?, ?, ?, ?)",
                        userId, proPlanId, now, nextMonth, true, "ACTIVE");
            } else {
                jdbcTemplate.update("UPDATE user_subscriptions SET plan_id = ?, status = 'ACTIVE' WHERE user_id = ?", proPlanId, userId);
            }
        }

        // 5. Query results for diagnostics
        List<Map<String, Object>> drivers = jdbcTemplate.queryForList("SELECT u.id, u.email, u.mobile, u.fullName, u.accountStatus, d.isAvailable, d.isOnTrip FROM users u LEFT JOIN drivers d ON u.id = d.user_id WHERE u.role = 'DRIVER'");
        List<Map<String, Object>> vehicles = jdbcTemplate.queryForList("SELECT id, vehicleNumber, driver_id, transporter_id FROM vehicles ORDER BY id DESC LIMIT 5");
        List<Map<String, Object>> plans = jdbcTemplate.queryForList("SELECT * FROM subscription_plans");
        List<Map<String, Object>> userSubs = jdbcTemplate.queryForList("SELECT * FROM user_subscriptions");

        return Map.of("drivers", drivers, "vehicles", vehicles, "plans", plans, "userSubs", userSubs);
    }

    /** E2E Verification: Direct SQL query for a single trip's full state */
    @GetMapping("/api/test-trip")
    public Map<String, Object> getTripState(
            @org.springframework.web.bind.annotation.RequestParam Long id) {
        List<Map<String, Object>> trips = jdbcTemplate.queryForList(
            "SELECT id, tripNumber, status, source, destination, " +
            "pickupReceiptUrl, locationEnabled, startedAt, completedAt, " +
            "distance, estimatedTravelTimeMins, tollPlazaCount, " +
            "estimatedTollCost, totalTollCost, fuelEstimateLiters, " +
            "fuelCost, carbonEmission, tripPdfUrl, assignmentPdfUrl, " +
            "finalInvoicePdfUrl, freightAmount, driver_id, vehicle_id, " +
            "shipper_id, transporter_id " +
            "FROM trips WHERE id = ?", id);

        List<Map<String, Object>> lrs = jdbcTemplate.queryForList(
            "SELECT lr_number, pdf_url, qr_code_url, generated_at FROM lorry_receipts WHERE trip_id = ?", id);

        return Map.of("trip", trips.isEmpty() ? Map.of("error","not found") : trips.get(0),
                      "lorryReceipt", lrs.isEmpty() ? Map.of("error","no LR found") : lrs.get(0));
    }

    @GetMapping("/api/test-all-trips")
    public List<Map<String, Object>> getAllTrips() {
        return jdbcTemplate.queryForList("SELECT id, tripNumber, status, driver_id, transporter_id FROM trips");
    }
}
