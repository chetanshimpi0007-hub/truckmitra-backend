import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DescribeSub {
    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection("jdbc:h2:file:./data/truckmitra", "SA", "");
             Statement stmt = conn.createStatement()) {
            ResultSet rs = stmt.executeQuery("SELECT * FROM user_subscriptions LIMIT 1");
            int count = rs.getMetaData().getColumnCount();
            for(int i=1; i<=count; i++) System.out.println(rs.getMetaData().getColumnName(i));
        } catch(Exception e) { e.printStackTrace(); }
    }
}
