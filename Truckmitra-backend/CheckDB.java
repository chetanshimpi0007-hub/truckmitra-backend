import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckDB {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:h2:file:./data/truckmitra", "SA", "");
            Statement stmt = conn.createStatement();
            
            System.out.println("--- DRIVERS ---");
            ResultSet rs = stmt.executeQuery("SELECT u.id, u.fullName, d.vehicleNumber FROM users u JOIN drivers d ON u.id = d.user_id WHERE u.role = 'DRIVER' ORDER BY u.id DESC LIMIT 5");
            while(rs.next()) {
                System.out.println("ID: " + rs.getLong("id") + ", Name: " + rs.getString("fullName") + ", VehicleNumber: " + rs.getString("vehicleNumber"));
            }
            
            System.out.println("TEST 1: Inner Join Drivers and Users");
            rs = stmt.executeQuery("select d1_0.user_id from drivers d1_0 join users d1_1 on d1_0.user_id=d1_1.id where d1_0.user_id=7");
            while(rs.next()) {
                System.out.println("Inner join exists: " + rs.getLong("user_id"));
            }
            
            System.out.println("Fixing NULL is_deleted and is_active...");
            int rows = stmt.executeUpdate("UPDATE vehicles SET is_deleted = false, is_active = true WHERE is_deleted IS NULL");
            System.out.println("Fixed " + rows + " vehicles.");
            
            rows = stmt.executeUpdate("UPDATE users SET is_deleted = false, is_active = true WHERE is_deleted IS NULL");
            System.out.println("Fixed " + rows + " users.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
