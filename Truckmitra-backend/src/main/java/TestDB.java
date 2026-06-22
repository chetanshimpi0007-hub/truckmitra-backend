import java.sql.*;

public class TestDB {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://ep-spring-poetry-aira0grk-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
        String user = "neondb_owner";
        String pass = "npg_PZGd8EphIbf9";

        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            System.out.println("--- Compare Users ---");
            String query = "SELECT id, fullname, accountstatus, isprofilecompleted, isverified FROM users WHERE id IN (31, 37, 46)";
            try (PreparedStatement stmt = conn.prepareStatement(query);
                 ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    System.out.println(
                        "ID: " + rs.getInt("id") + " | " + 
                        rs.getString("fullname") + 
                        " | accountstatus: " + rs.getString("accountstatus") + 
                        " | isprofilecompleted: " + rs.getObject("isprofilecompleted") + 
                        " | isverified: " + rs.getObject("isverified")
                    );
                }
            }
        }
    }
}
