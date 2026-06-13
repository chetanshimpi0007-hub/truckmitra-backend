import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class InsertSub {
    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection("jdbc:h2:file:./data/truckmitra", "SA", "");
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate("INSERT INTO user_subscriptions (id, user_id, plan_id, status, start_date, end_date) VALUES (999, 39, 1, 'ACTIVE', CURRENT_TIMESTAMP, DATEADD('MONTH', 1, CURRENT_TIMESTAMP))");
            System.out.println("Sub inserted.");
        } catch(Exception e) { e.printStackTrace(); }
    }
}
