// src/main/java/com/truckmitra/security/oauth2/FacebookTokenValidator.java
package com.truckmitra.security.oauth2;

import com.truckmitra.exception.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Component
public class FacebookTokenValidator {

    // Fix: Use the same property names as in application.properties
    @Value("${spring.security.oauth2.client.registration.facebook.client-id}")
    private String facebookAppId;

    @Value("${spring.security.oauth2.client.registration.facebook.client-secret}")
    private String facebookAppSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> validateToken(String accessToken) {
        try {
            // Facebook debug token endpoint
            String debugUrl = String.format(
                "https://graph.facebook.com/debug_token?input_token=%s&access_token=%s|%s",
                accessToken, facebookAppId, facebookAppSecret
            );

            ResponseEntity<Map> response = restTemplate.getForEntity(debugUrl, Map.class);
            
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new UnauthorizedException("Failed to validate Facebook token");
            }

            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            
            if (data == null || !Boolean.TRUE.equals(data.get("is_valid"))) {
                throw new UnauthorizedException("Invalid Facebook token");
            }

            // Get user info
            String userInfoUrl = String.format(
                "https://graph.facebook.com/me?fields=id,name,email,picture&access_token=%s",
                accessToken
            );

            ResponseEntity<Map> userInfo = restTemplate.getForEntity(userInfoUrl, Map.class);
            
            log.info("Facebook token validated for user: {}", userInfo.getBody().get("name"));

            return userInfo.getBody();

        } catch (Exception e) {
            log.error("Failed to validate Facebook token", e);
            throw new UnauthorizedException("Failed to validate Facebook token: " + e.getMessage());
        }
    }
}