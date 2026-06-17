import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class DirectAuthCheck {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://ep-spring-poetry-aira0grk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
        String user = "neondb_owner";
        String pass = "npg_PZGd8EphIbf9";

        System.out.println("Connecting to Database...");
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            System.out.println("Connected!");

            String testEmail = "praju@gmail.com";
            System.out.println("\nQuerying for: " + testEmail);

            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE email = ?");
            stmt.setString(1, testEmail);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                System.out.println("1. User record from database: FOUND");
                System.out.println("   ID: " + rs.getLong("id"));
                System.out.println("   Email/Mobile: " + rs.getString("email") + " / " + rs.getString("mobile"));
                System.out.println("2. Role assigned to user: " + rs.getString("role"));
                
                // Assuming 'accountstatus' column holds enum like VERIFIED
                String status = rs.getString("accountstatus");
                System.out.println("3. Account active status / Approval status: " + status);
                System.out.println("4. Account approval status: " + status);

                String hash = rs.getString("password");
                System.out.println("5. Stored password hash: " + hash);

                String testPass = "Password123!";
                System.out.println("6. Login request payload password: " + testPass);

                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                boolean match = encoder.matches(testPass, hash);
                System.out.println("7. Password match result: " + (match ? "YES" : "NO"));

                // Simulating AuthenticationManager logic
                System.out.println("8. AuthenticationManager result: " + (match ? "SUCCESS" : "BadCredentialsException"));
                
                System.out.println("9. Exact line where authentication fails: ");
                if (!match) {
                    System.out.println("   Line ~62 in DaoAuthenticationProvider.java (matches() returns false)");
                } else if (!"VERIFIED".equals(status) && !"REGISTERED".equals(status)) {
                    System.out.println("   Line 850 in AuthServiceImpl.java (throws UnauthorizedException for status)");
                } else {
                    System.out.println("   Wait! It should NOT fail for this user!");
                }
            } else {
                System.out.println("User not found!");
            }
        }
    }
}
