import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckE2E {
    public static void main(String[] args) {
        String url = "jdbc:h2:file:./data/truckmitra";
        String user = "SA";
        String pass = "";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {

            System.out.println("Latest Drivers:");
            ResultSet rs = stmt.executeQuery("SELECT d.user_id, u.fullName, d.vehicleNumber, d.vehicleCapacity FROM drivers d JOIN users u ON d.user_id = u.id ORDER BY d.user_id DESC LIMIT 5");
            while (rs.next()) {
                System.out.println("Driver: " + rs.getLong(1) + " | " + rs.getString(2) + " | VehNum: " + rs.getString(3) + " | VehCap: " + rs.getString(4));
            }

            System.out.println("Latest Vehicles:");
            ResultSet rs2 = stmt.executeQuery("SELECT id, vehicleNumber, driver_id, transporter_id FROM vehicles ORDER BY id DESC LIMIT 5");
            while (rs2.next()) {
                System.out.println("Vehicle: " + rs2.getLong(1) + " | VehNum: " + rs2.getString(2) + " | DriverId: " + rs2.getLong(3) + " | TransporterId: " + rs2.getLong(4));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
