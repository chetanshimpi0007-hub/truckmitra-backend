import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DbCheckVehicles {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:h2:file:./data/truckmitra;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
        Connection conn = DriverManager.getConnection(url, "sa", "");
        Statement stmt = conn.createStatement();

        System.out.println("--- VEHICLES ---");
        ResultSet rs = stmt.executeQuery(
            "SELECT id, vehicle_number, vehicle_type, capacity, is_available, transporter_id " +
            "FROM vehicles"
        );
        while (rs.next()) {
            System.out.println("Vehicle ID: " + rs.getLong("id") + 
                               ", Number: " + rs.getString("vehicle_number") + 
                               ", Available: " + rs.getBoolean("is_available") +
                               ", Transporter ID: " + rs.getLong("transporter_id"));
        }

        conn.close();
    }
}
