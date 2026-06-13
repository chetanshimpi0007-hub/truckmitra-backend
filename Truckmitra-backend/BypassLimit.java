import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class BypassLimit {
    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection("jdbc:h2:file:./data/truckmitra", "SA", "");
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate("UPDATE transporters SET totalDrivers = 0 WHERE user_id = 39");
            System.out.println("Limit bypassed.");
        } catch(Exception e) { e.printStackTrace(); }
    }
}
