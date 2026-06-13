import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckVehicles {
    public static void main(String[] args) throws Exception {
        Class.forName("org.h2.Driver");
        Connection conn = DriverManager.getConnection("jdbc:h2:file:./data/truckmitra", "sa", "");
        Statement stmt = conn.createStatement();
        
        System.out.println("--- VEHICLES ---");
        ResultSet rs = stmt.executeQuery("SELECT count(*) FROM vehicles");
        if(rs.next()) {
            System.out.println("Total Vehicles: " + rs.getInt(1));
        }
        
        rs = stmt.executeQuery("SELECT id, vehicleNumber, transporter_id FROM vehicles LIMIT 20");
        while(rs.next()) {
            System.out.println("Vehicle ID: " + rs.getLong("id") + ", Number: " + rs.getString("vehicleNumber") + ", TransporterId: " + rs.getLong("transporter_id"));
        }
        
        System.out.println("--- TRANSPORTER ---");
        rs = stmt.executeQuery("SELECT u.id, u.mobile, t.agencyName FROM users u JOIN transporters t ON u.id = t.user_id");
        while(rs.next()) {
            System.out.println("Transporter User ID: " + rs.getLong("id") + ", Mobile: " + rs.getString("mobile") + ", Company: " + rs.getString("agencyName"));
        }
        
        System.out.println("--- JOIN TABLES ---");
        rs = stmt.executeQuery("SELECT count(*) FROM transporter_vehicles");
        if(rs.next()) {
            System.out.println("Transporter_Vehicles join table count: " + rs.getInt(1));
        }

        rs.close();
        stmt.close();
        conn.close();
    }
}
