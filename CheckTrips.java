import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.ResultSetMetaData;

public class CheckTrips {
    public static void main(String[] args) {
        String url = "jdbc:h2:file:./Truckmitra-backend/data/truckmitra";
        String user = "SA";
        String pass = "";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {

            printTable(stmt, "SELECT * FROM trips", "TRIPS");
            printTable(stmt, "SELECT id, email, fullName, role FROM users WHERE id IN (SELECT DISTINCT driver_id FROM trips UNION SELECT DISTINCT transporter_id FROM trips)", "USERS INVOLVED IN TRIPS");
            printTable(stmt, "SELECT * FROM lorry_receipts WHERE trip_id = 1", "LORRY RECEIPTS");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void printTable(Statement stmt, String sql, String title) throws Exception {
        System.out.println("=== " + title + " ===");
        try (ResultSet rs = stmt.executeQuery(sql)) {
            ResultSetMetaData rsmd = rs.getMetaData();
            int colCount = rsmd.getColumnCount();
            for (int i = 1; i <= colCount; i++) {
                System.out.print(rsmd.getColumnName(i) + "\t");
            }
            System.out.println();
            while (rs.next()) {
                for (int i = 1; i <= colCount; i++) {
                    System.out.print(rs.getString(i) + "\t");
                }
                System.out.println();
            }
        }
        System.out.println();
    }
}
