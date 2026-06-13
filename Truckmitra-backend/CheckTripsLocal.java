import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckTripsLocal {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:h2:file:./data/truckmitra;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
        Connection conn = DriverManager.getConnection(url, "sa", "");
        Statement stmt = conn.createStatement();

        System.out.println("--- completed trips ---");
        ResultSet rs = stmt.executeQuery("SELECT * FROM trips WHERE status = 'COMPLETED'");
        while (rs.next()) {
            System.out.println("Trip ID: " + rs.getLong("id") + 
                               ", Status: " + rs.getString("status") +
                               ", Driver ID: " + rs.getLong("driver_id") +
                               ", Transporter ID: " + rs.getLong("transporter_id") +
                               ", Load ID: " + rs.getLong("load_id") + 
                               ", Vehicle ID: " + rs.getLong("vehicle_id"));
        }

        conn.close();
    }
}
