// src/main/java/com/truckmitra/service/notification/NotificationService.java
package com.truckmitra.service.notification;

import com.truckmitra.dto.request.NotificationRequest;
import com.truckmitra.dto.response.NotificationResponse;
import com.truckmitra.entity.notification.NotificationLog;
import com.truckmitra.entity.user.User;
import com.truckmitra.enums.ChannelType;
import com.truckmitra.enums.NotificationStatus;
import com.truckmitra.enums.NotificationTemplate;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.repository.notification.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationFactory factory;
    private final NotificationLogRepository logRepository;
    private final UserRepository userRepository;  // Add this

    @Value("${socket.server.url:http://localhost:4000}")
    private String socketServerUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Async
    @Transactional
    public void sendNotification(NotificationRequest request) {
        NotificationLog logEntry = createLogEntry(request);
        
        try {
            NotificationProvider provider = factory.getProvider(request.channelType());
            provider.send(request);
            
            // Update log as SENT
            updateLogStatus(logEntry.getId(), NotificationStatus.SENT, null);
            
        } catch (Exception e) {
            log.error("Notification failed for user: {}", request.userId(), e);
            updateLogStatus(logEntry.getId(), NotificationStatus.FAILED, e.getMessage());
            
            // Retry logic for important notifications
            handleRetry(request, logEntry);
        }
    }

    /**
     * Helper method to send simple text notification
     */
    @Async
    public void sendNotification(Long userId, String message) {
        String recipient = getUserEmailOrPhone(userId);
        if (recipient == null) {
            log.warn("Cannot send notification to user {}: No email/phone found", userId);
            return;
        }

        NotificationRequest request = new NotificationRequest(
            userId,
            recipient,
            ChannelType.PUSH,
            NotificationTemplate.NOTIFICATION,
            Map.of("message", message),
            "TruckMitra Notification"
        );
        sendNotification(request);
    }

    /**
     * Helper method to send notification with custom channel
     */
    @Async
    public void sendNotification(Long userId, String message, ChannelType channel) {
        String recipient = getUserEmailOrPhone(userId);
        if (recipient == null) {
            log.warn("Cannot send notification to user {}: No email/phone found", userId);
            return;
        }

        NotificationRequest request = new NotificationRequest(
            userId,
            recipient,
            channel,
            NotificationTemplate.NOTIFICATION,
            Map.of("message", message),
            "TruckMitra Notification"
        );
        sendNotification(request);
    }

    /**
     * Helper method to send notification with template data
     */
    @Async
    public void sendNotification(Long userId, NotificationTemplate template, 
                                 Map<String, Object> data, String subject) {
        String recipient = getUserEmailOrPhone(userId);
        if (recipient == null) {
            log.warn("Cannot send notification to user {}: No email/phone found", userId);
            return;
        }

        NotificationRequest request = new NotificationRequest(
            userId,
            recipient,
            ChannelType.EMAIL,
            template,
            data,
            subject
        );
        sendNotification(request);
    }

    /**
     * Send OTP via SMS
     */
    @Async
    public void sendOtpSms(String mobile, String otp) {
        String message = String.format("Your TruckMitra OTP is: %s. Valid for 5 minutes.", otp);
        
        NotificationRequest request = new NotificationRequest(
            0L,
            mobile,
            ChannelType.SMS,
            NotificationTemplate.NOTIFICATION,
            Map.of("message", message),
            "TruckMitra OTP Verification"
        );
        
        sendNotification(request);
    }

    /**
     * Forward a generic notification payload to socket server /api/notify
     */
    public void forwardNotifyToSocket(Object payload) {
        try {
            String url = socketServerUrl + "/api/notify";
            restTemplate.postForEntity(url, payload, String.class);
        } catch (Exception e) {
            log.error("Failed to forward notification to socket server at {}", socketServerUrl, e);
        }
    }

    /**
     * Forward chat payload to socket server /api/chat
     */
    public void forwardChatToSocket(Object payload) {
        try {
            String url = socketServerUrl + "/api/chat";
            restTemplate.postForEntity(url, payload, String.class);
        } catch (Exception e) {
            log.error("Failed to forward chat to socket server at {}", socketServerUrl, e);
        }
    }

    /**
     * Helper method to get user's contact info from database
     */
    private String getUserEmailOrPhone(Long userId) {
        if (userId == null || userId == 0L) {
            return null;  // System user or invalid
        }
        
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                log.warn("User not found with ID: {}", userId);
                return null;
            }
            
            // Return email if available, otherwise mobile
            if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                return user.getEmail();
            } else if (user.getMobile() != null && !user.getMobile().isEmpty()) {
                return user.getMobile();
            } else {
                log.warn("User {} has no email or mobile", userId);
                return null;
            }
        } catch (Exception e) {
            log.error("Error fetching user contact info for ID: {}", userId, e);
            return null;
        }
    }

    private NotificationLog createLogEntry(NotificationRequest request) {
        NotificationLog log = NotificationLog.builder()
            .userId(request.userId())
            .recipientAddress(request.recipientAddress())
            .channelType(request.channelType())
            .subject(request.subject() != null ? request.subject() : "TruckMitra Notification")
            .contentBody("Template: " + request.template().name())
            .status(NotificationStatus.QUEUED)
            .retryCount(0)
            .templateName(request.template().getTemplateName())
            .build();
        
        return logRepository.save(log);
    }

    private void updateLogStatus(Long logId, NotificationStatus status, String errorMessage) {
        NotificationLog log = logRepository.findById(logId)
            .orElseThrow(() -> new RuntimeException("Log not found"));
        
        log.setStatus(status);
        if (status == NotificationStatus.SENT) {
            log.setSentAt(LocalDateTime.now());
        }
        if (errorMessage != null) {
            log.setErrorMessage(errorMessage);
        }
        
        logRepository.save(log);
    }

    private void handleRetry(NotificationRequest request, NotificationLog logEntry) {
        if (logEntry.getRetryCount() < 3) {
            logEntry.setRetryCount(logEntry.getRetryCount() + 1);
            logEntry.setStatus(NotificationStatus.RETRYING);
            logRepository.save(logEntry);
            
            scheduleRetry(request, logEntry.getId());
        }
    }

    @Async
    protected void scheduleRetry(NotificationRequest request, Long logId) {
        try {
            Thread.sleep(300000); // 5 minutes wait
            sendNotification(request);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Retry interrupted for logId: {}", logId);
        }
    }

    // Query methods
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        return logRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
            .map(this::mapToResponse);
    }

    public NotificationResponse getNotificationStatus(Long notificationId) {
        NotificationLog log = logRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        return mapToResponse(log);
    }

    private NotificationResponse mapToResponse(NotificationLog log) {
        return new NotificationResponse(
            log.getId(),
            log.getUserId(),
            log.getRecipientAddress(),
            log.getChannelType(),
            log.getSubject(),
            log.getStatus(),
            log.getSentAt(),
            log.getCreatedAt()
        );
    }
}