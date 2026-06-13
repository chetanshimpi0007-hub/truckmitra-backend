import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class RestoreDB {
    public static void main(String[] args) {
        String scriptPath = "./data/truckmitra.h2.sql";
        try {
            System.out.println("Modifying SQL script to fix H2 enum value mappings...");
            String content = new String(Files.readAllBytes(Paths.get(scriptPath)), StandardCharsets.UTF_8);
            
            // Fix preferredVehicleType enum
            String oldStr1 = "TRUE, TRUE, NULL, NULL, 0.0, NULL, NULL, 4, 0.0, 0.0";
            String newStr1 = "TRUE, TRUE, NULL, NULL, 0.0, NULL, NULL, 'PICKUP', 0.0, 0.0";
            
            // Fix transactionType enum
            String oldStr2 = ", 9, NULL, NULL, NULL, 39, 'TRANSPORTER', 35);";
            String newStr2 = ", 'TRIP_PAYMENT', NULL, NULL, NULL, 39, 'TRANSPORTER', 35);";
            
            boolean modified = false;
            if (content.contains(oldStr1)) {
                content = content.replace(oldStr1, newStr1);
                modified = true;
                System.out.println("Modified preferredVehicleType enum successfully.");
            }
            if (content.contains(oldStr2)) {
                content = content.replace(oldStr2, newStr2);
                modified = true;
                System.out.println("Modified transactionType enum successfully.");
            }
            
            if (modified) {
                Files.write(Paths.get(scriptPath), content.getBytes(StandardCharsets.UTF_8));
            } else {
                System.out.println("Target strings not found (maybe already modified).");
            }
        } catch (IOException e) {
            System.err.println("Failed to read/write script file: " + e.getMessage());
            e.printStackTrace();
            return;
        }

        // Delete existing H2 database files to ensure clean restore
        try {
            System.out.println("Deleting existing database files to prevent duplicate table errors...");
            Files.deleteIfExists(Paths.get("./data/truckmitra.mv.db"));
            Files.deleteIfExists(Paths.get("./data/truckmitra.trace.db"));
            System.out.println("Deleted database files.");
        } catch (IOException e) {
            System.err.println("Failed to delete existing database files (might be locked): " + e.getMessage());
        }

        String url = "jdbc:h2:file:./data/truckmitra;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
        String user = "sa";
        String pass = "";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Restoring database from ./data/truckmitra.h2.sql ...");
            stmt.execute("RUNSCRIPT FROM './data/truckmitra.h2.sql'");
            System.out.println("Restore completed successfully!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
