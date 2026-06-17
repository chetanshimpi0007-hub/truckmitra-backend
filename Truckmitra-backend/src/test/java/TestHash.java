import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("praju (12345678): " + encoder.matches("12345678", "$2a$10$ZT2QwHaeFkZxQMtRV0CoIOvEpj8h0/xbcOU8og1.cAu/CmFktHSRe"));
        System.out.println("praju (praju123): " + encoder.matches("praju123", "$2a$10$ZT2QwHaeFkZxQMtRV0CoIOvEpj8h0/xbcOU8og1.cAu/CmFktHSRe"));
    }
}
