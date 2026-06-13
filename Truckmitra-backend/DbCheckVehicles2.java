import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.ResultSetMetaData;

public class DbCheckVehicles2 {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:h2:file:./data/truckmitra;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
        Connection conn = DriverManager.getConnection(url, "sa", "");
        Statement stmt = conn.createStatement();

        System.out.println("--- VEHICLES ---");
        ResultSet rs = stmt.executeQuery("SELECT * FROM vehicles");
        ResultSetMetaData rsmd = rs.getMetaData();
        while (rs.next()) {
            StringBuilder row = new StringBuilder("Vehicle: ");
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                row.append(rsmd.getColumnName(i)).append("=").append(rs.getObject(i)).append(", ");
            }
            System.out.println(row.toString());
        }

        System.out.println("\n--- TRANSPORTER VEHICLES ---");
        try {
            rs = stmt.executeQuery("SELECT * FROM transporter_vehicles");
            rsmd = rs.getMetaData();
            while (rs.next()) {
                StringBuilder row = new StringBuilder("Mapping: ");
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    row.append(rsmd.getColumnName(i)).append("=").append(rs.getObject(i)).append(", ");
                }
                System.out.println(row.toString());
            }
        } catch (Exception e) {
            System.out.println("No transporter_vehicles table: " + e.getMessage());
        }

        conn.close();
    }
}
