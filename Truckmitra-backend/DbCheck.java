import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DbCheck {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:h2:file:./data/truckmitra;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
        Connection conn = DriverManager.getConnection(url, "sa", "");
        Statement stmt = conn.createStatement();

        System.out.println("--- load_bids ---");
        ResultSet rs = stmt.executeQuery("SELECT id, amount, status, load_id, transporter_id FROM load_bids");
        while (rs.next()) {
            System.out.println("Bid ID: " + rs.getLong("id") + 
                               ", Amount: " + rs.getDouble("amount") + 
                               ", Status: " + rs.getString("status") +
                               ", Load ID: " + rs.getLong("load_id") +
                               ", Transporter ID: " + rs.getLong("transporter_id"));
        }

        System.out.println("\n--- loads ---");
        rs = stmt.executeQuery("SELECT id, status, transporter_id FROM loads");
        while (rs.next()) {
            System.out.println("Load ID: " + rs.getLong("id") + 
                               ", Status: " + rs.getString("status") +
                               ", Assigned Transporter ID: " + rs.getLong("transporter_id"));
        }

        conn.close();
    }
}
