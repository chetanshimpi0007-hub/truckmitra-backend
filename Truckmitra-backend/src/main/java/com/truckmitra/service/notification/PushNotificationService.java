package com.truckmitra.service.notification;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.truckmitra.entity.user.DeviceToken;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.user.DeviceTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.truckmitra.dto.request.NotificationRequest;
import com.truckmitra.enums.ChannelType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService implements NotificationProvider {

    private final DeviceTokenRepository deviceTokenRepository;
    
    // In memory counter for tracking admin analytics
    private long totalDelivered = 0;
    private long totalFailed = 0;

    @Override
    public ChannelType getChannelType() {
        return ChannelType.PUSH;
    }

    @Override
    public void send(NotificationRequest request) throws Exception {
        Map<String, Object> reqData = request.templateData();
        String body = (reqData != null && reqData.containsKey("message")) 
            ? reqData.get("message").toString() : request.subject();
            
        Map<String, String> stringData = null;
        if (reqData != null) {
            stringData = new java.util.HashMap<>();
            for (Map.Entry<String, Object> entry : reqData.entrySet()) {
                stringData.put(entry.getKey(), String.valueOf(entry.getValue()));
            }
        }
        
        sendPushNotificationToUserId(request.userId(), request.subject(), body, stringData);
    }
    
    @Transactional
    public void sendPushNotificationToUserId(Long userId, String title, String body, Map<String, String> data) {
        List<DeviceToken> tokens = deviceTokenRepository.findByUserIdAndIsActiveTrue(userId);
        
        if (tokens.isEmpty()) {
            return; // No active devices
        }
        
        for (DeviceToken deviceToken : tokens) {
            sendToToken(deviceToken, title, body, data);
        }
    }

    @Transactional
    public void sendPushNotificationToUser(User user, String title, String body, Map<String, String> data) {
        List<DeviceToken> tokens = deviceTokenRepository.findByUserAndIsActiveTrue(user);
        
        if (tokens.isEmpty()) {
            return; // No active devices
        }
        
        for (DeviceToken deviceToken : tokens) {
            sendToToken(deviceToken, title, body, data);
        }
    }

    private void sendToToken(DeviceToken deviceToken, String title, String body, Map<String, String> data) {
        try {
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            Message.Builder messageBuilder = Message.builder()
                    .setToken(deviceToken.getToken())
                    .setNotification(notification);

            if (data != null) {
                messageBuilder.putAllData(data);
            }

            // If FirebaseApp is not initialized (dummy config), skip sending
            if (!com.google.firebase.FirebaseApp.getApps().isEmpty()) {
                String response = FirebaseMessaging.getInstance().send(messageBuilder.build());
                log.info("Successfully sent message: {}", response);
                totalDelivered++;
            } else {
                log.warn("Firebase not initialized. Skipped push notification.");
            }
        } catch (Exception e) {
            log.error("Failed to send push notification to token {}: {}", deviceToken.getToken(), e.getMessage());
            totalFailed++;
            // Optionally, if the token is invalid/unregistered, delete it
            if (e.getMessage() != null && e.getMessage().contains("UNREGISTERED")) {
                deviceTokenRepository.deleteByToken(deviceToken.getToken());
            }
        }
    }
    
    public long getTotalDelivered() {
        return totalDelivered;
    }
    
    public long getTotalFailed() {
        return totalFailed;
    }
    
    public long getRegisteredDevicesCount() {
        return deviceTokenRepository.countByIsActiveTrue();
    }
}
