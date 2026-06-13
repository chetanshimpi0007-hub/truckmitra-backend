package com.truckmitra.service.impl;

import com.truckmitra.entity.Notification;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.NotificationRepository;
import com.truckmitra.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendNotification(User user, String title, String message, Notification.NotificationType type) {
        // 1. Save to Database
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .readStatus(false)
                .build();
        notificationRepository.save(notification);

        // 2. Push via WebSocket
        try {
            messagingTemplate.convertAndSendToUser(user.getEmail(), "/topic/notifications", notification);
        } catch (Exception e) {
            log.error("WebSocket push failed for user: {}", user.getEmail());
        }

        // 3. Optional: Trigger External Channels based on priority or type
        if (type == Notification.NotificationType.TRIP || type == Notification.NotificationType.WALLET) {
            sendWhatsApp(user.getMobile(), message);
            sendEmail(user.getEmail(), title, message);
        }
    }

    @Override
    public void sendWhatsApp(String mobile, String message) {
        // Stub for WhatsApp API (e.g., Twilio)
        log.info("Sending WhatsApp to {}: {}", mobile, message);
    }

    @Override
    public void sendEmail(String email, String subject, String body) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(email);
            mail.setSubject(subject);
            mail.setText(body);
            mailSender.send(mail);
        } catch (Exception e) {
            log.error("Email sending failed for {}: {}", email, e.getMessage());
        }
    }

    @Override
    public void sendEmailWithAttachment(String email, String subject, String body, String attachmentName, byte[] attachmentBytes) {
        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = 
                new org.springframework.mail.javamail.MimeMessageHelper(message, true);
            
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(body);
            
            helper.addAttachment(attachmentName, new org.springframework.core.io.ByteArrayResource(attachmentBytes));
            
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Email sending with attachment failed for {}: {}", email, e.getMessage());
        }
    }
}
