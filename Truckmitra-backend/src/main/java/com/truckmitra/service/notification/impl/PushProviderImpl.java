// src/main/java/com/truckmitra/service/notification/impl/PushProviderImpl.java
package com.truckmitra.service.notification.impl;

import com.truckmitra.dto.request.NotificationRequest;
import com.truckmitra.enums.ChannelType;
import com.truckmitra.service.notification.NotificationProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class PushProviderImpl implements NotificationProvider {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public ChannelType getChannelType() {
        return ChannelType.PUSH;
    }

    @Override
    public void send(NotificationRequest request) throws Exception {
        log.info("Sending PUSH notification via Socket.io Node server to user {}", request.userId());
        
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", request.userId());
            
            // Extract a message string or fallback appropriately
            String messageStr = "New Notification";
            if (request.templateData() != null && request.templateData().containsKey("message")) {
                messageStr = request.templateData().get("message").toString();
            }
            
            payload.put("message", messageStr);
            payload.put("payload", request);
            
            ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:4000/api/notify", payload, String.class);
            log.info("Push notification broadcasted successfully to Socket.io: {}", response.getStatusCode());
        } catch (Exception e) {
            log.error("Failed to send push notification to Socket.io", e);
        }
    }
}