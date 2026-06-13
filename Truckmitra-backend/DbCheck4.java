import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DbCheck4 {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:h2:file:./data/truckmitra;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
        Connection conn = DriverManager.getConnection(url, "sa", "");
        Statement stmt = conn.createStatement();

        System.out.println("\n--- TRANSPORTER DRIVER LISTS ---");
        ResultSet rs = stmt.executeQuery("SELECT transporter_id, driver_id FROM transporter_drivers");
        while (rs.next()) {
            System.out.println("Transporter: " + rs.getLong("transporter_id") + 
                               ", Driver ID in list: " + rs.getLong("driver_id"));
        }

        conn.close();
    }
}
