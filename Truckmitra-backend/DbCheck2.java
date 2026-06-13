import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DbCheck2 {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:h2:file:./data/truckmitra;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
        Connection conn = DriverManager.getConnection(url, "sa", "");
        Statement stmt = conn.createStatement();

        System.out.println("--- drivers ---");
        ResultSet rs = stmt.executeQuery(
            "SELECT u.id, u.fullname, u.mobile, u.accountstatus, d.is_available, d.is_on_trip, d.transporter_id " +
            "FROM drivers d JOIN users u ON d.user_id = u.id"
        );
        while (rs.next()) {
            System.out.println("Driver ID: " + rs.getLong("id") + 
                               ", Name: " + rs.getString("fullname") + 
                               ", Mobile: " + rs.getString("mobile") + 
                               ", Status: " + rs.getString("accountstatus") +
                               ", Available: " + rs.getBoolean("is_available") +
                               ", On Trip: " + rs.getBoolean("is_on_trip") +
                               ", Transporter: " + rs.getLong("transporter_id"));
        }
        conn.close();
    }
}
