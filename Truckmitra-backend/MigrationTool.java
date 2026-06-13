import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class MigrationTool {
    public static void main(String[] args) {
        String url = "jdbc:h2:file:./data/truckmitra";
        String user = "SA";
        String pass = "";

        int orphanedDriversFound = 0;
        int vehiclesCreated = 0;

        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            // Find orphaned drivers
            String findSql = "SELECT d.user_id, d.vehicleNumber, d.vehicleCapacity, d.transporter_id, d.preferredVehicleType " +
                             "FROM drivers d " +
                             "LEFT JOIN vehicles v ON d.user_id = v.driver_id " +
                             "WHERE d.vehicleNumber IS NOT NULL AND d.vehicleNumber != '' AND v.id IS NULL";

            try (PreparedStatement findStmt = conn.prepareStatement(findSql);
                 ResultSet rs = findStmt.executeQuery()) {

                while (rs.next()) {
                    orphanedDriversFound++;
                    long driverId = rs.getLong("user_id");
                    String vehicleNumber = rs.getString("vehicleNumber");
                    String capacityStr = rs.getString("vehicleCapacity");
                    long transporterId = rs.getLong("transporter_id");
                    String vehicleType = rs.getString("preferredVehicleType");

                    if (vehicleType == null || vehicleType.trim().isEmpty()) {
                        vehicleType = "TRUCK";
                    }

                    double capacity = 1.0;
                    if (capacityStr != null) {
                        try {
                            String digits = capacityStr.replaceAll("[^0-9.]", "");
                            if (!digits.isEmpty()) {
                                capacity = Double.parseDouble(digits);
                            }
                        } catch (Exception e) {}
                    }

                    // Insert Vehicle
                    String insertVehicleSql = "INSERT INTO vehicles (vehicleNumber, vehicleType, capacity, driver_id, transporter_id, is_active, created_at, updated_at) " +
                                              "VALUES (?, ?, ?, ?, ?, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
                    
                    try (PreparedStatement insertStmt = conn.prepareStatement(insertVehicleSql, Statement.RETURN_GENERATED_KEYS)) {
                        insertStmt.setString(1, vehicleNumber);
                        insertStmt.setString(2, vehicleType);
                        insertStmt.setDouble(3, capacity);
                        insertStmt.setLong(4, driverId);
                        
                        if (transporterId > 0) {
                            insertStmt.setLong(5, transporterId);
                        } else {
                            insertStmt.setNull(5, java.sql.Types.BIGINT);
                        }

                        int affected = insertStmt.executeUpdate();
                        if (affected > 0) {
                            vehiclesCreated++;
                            try (ResultSet keys = insertStmt.getGeneratedKeys()) {
                                if (keys.next()) {
                                    long vehicleId = keys.getLong(1);
                                    // Add to transporter_vehicles if transporter exists
                                    if (transporterId > 0) {
                                        String insertTransporterVehicle = "INSERT INTO transporter_vehicles (transporter_user_id, vehicles_id) VALUES (?, ?)";
                                        try (PreparedStatement tvStmt = conn.prepareStatement(insertTransporterVehicle)) {
                                            tvStmt.setLong(1, transporterId);
                                            tvStmt.setLong(2, vehicleId);
                                            tvStmt.executeUpdate();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            System.out.println("Orphaned drivers found: " + orphanedDriversFound);
            System.out.println("Vehicles created: " + vehiclesCreated);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
