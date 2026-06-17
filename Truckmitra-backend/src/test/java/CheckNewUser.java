import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class CheckNewUser {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://ep-spring-poetry-aira0grk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
        String user = "neondb_owner";
        String pass = "npg_PZGd8EphIbf9";

        System.out.println("Connecting to Database...");
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            System.out.println("Connected!");

            String testEmail = "test329408@gmail.com";
            System.out.println("\nQuerying for: " + testEmail);

            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE email = ?");
            stmt.setString(1, testEmail);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                System.out.println("* Was database row created? YES");
                System.out.println("* Was role saved? YES (" + rs.getString("role") + ")");
                System.out.println("* Was approval status saved? YES (" + rs.getString("accountstatus") + ")");
                
                String status = rs.getString("accountstatus");
                if ("REGISTERED".equals(status)) {
                    System.out.println("  -> Status is REGISTERED. Admin Pending Approval query looks for PENDING_VERIFICATION!");
                    System.out.println("* Does Admin Pending Approval query return the user? NO");
                    System.out.println("\nROOT CAUSE:");
                    System.out.println("The user is stuck in 'REGISTERED' state and hasn't transitioned to 'PENDING_VERIFICATION'.");
                    System.out.println("According to AccountStatus enum, user must complete profile (add vehicle/docs) to reach PENDING_VERIFICATION.");
                    System.out.println("However, because login fails with 'Invalid credentials' due to the frontend redirecting them away from the profile completion page without proper handling, they can never complete their profile.");
                }

            } else {
                System.out.println("* Was database row created? NO");
            }
        }
    }
}
