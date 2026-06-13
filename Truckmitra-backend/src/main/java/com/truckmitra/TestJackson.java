import com.fasterxml.jackson.databind.ObjectMapper;
import com.truckmitra.dto.request.auth.RegisterRequest;

public class TestJackson {
    public static void main(String[] args) throws Exception {
        String json = "{\"fullName\":\"John Doe\",\"vehicleNumber\":\"MH1234\", \"role\":\"DRIVER\", \"preferredLoginType\":\"EMAIL_PASSWORD\"}";
        ObjectMapper mapper = new ObjectMapper();
        RegisterRequest req = mapper.readValue(json, RegisterRequest.class);
        System.out.println("FullName: " + req.fullName());
        System.out.println("VehicleNumber: " + req.vehicleNumber());
    }
}
