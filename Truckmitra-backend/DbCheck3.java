import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DbCheck3 {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:h2:file:./data/truckmitra;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
        Connection conn = DriverManager.getConnection(url, "sa", "");
        Statement stmt = conn.createStatement();

        System.out.println("--- USERS & DRIVERS ---");
        ResultSet rs = stmt.executeQuery(
            "SELECT u.id, u.fullname, u.accountStatus, u.is_active, d.isAvailable, d.isOnTrip, d.transporter_id " +
            "FROM users u JOIN drivers d ON u.id = d.user_id"
        );
        while (rs.next()) {
            System.out.println("Driver User ID: " + rs.getLong("id") + 
                               ", Name: " + rs.getString("fullname") + 
                               ", AccountStatus: " + rs.getString("accountStatus") +
                               ", is_active: " + rs.getBoolean("is_active") +
                               ", isAvailable: " + rs.getBoolean("isAvailable") +
                               ", isOnTrip: " + rs.getBoolean("isOnTrip") +
                               ", Transporter ID: " + rs.getLong("transporter_id"));
        }

        System.out.println("\n--- TRANSPORTER DRIVER LISTS ---");
        try {
            rs = stmt.executeQuery("SELECT transporter_id, driver_ids FROM transporter_drivers");
            while (rs.next()) {
                System.out.println("Transporter: " + rs.getLong("transporter_id") + 
                                   ", Driver ID in list: " + rs.getLong("driver_ids"));
            }
        } catch (Exception e) {
            System.out.println("Table transporter_drivers might not exist: " + e.getMessage());
        }

        conn.close();
    }
}
