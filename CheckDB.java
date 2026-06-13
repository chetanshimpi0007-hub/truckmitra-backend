import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.ResultSetMetaData;

public class CheckDB {
    public static void main(String[] args) {
        String url = "jdbc:h2:file:./Truckmitra-backend/data/truckmitra";
        String user = "SA";
        String pass = "";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {

            System.out.println("drivers columns:");
            ResultSet rs = stmt.executeQuery("SELECT * FROM drivers LIMIT 1");
            ResultSetMetaData rsmd = rs.getMetaData();
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                System.out.println(rsmd.getColumnName(i));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
