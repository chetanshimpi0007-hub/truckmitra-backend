package com.truckmitra.service;

import com.truckmitra.entity.Notification;
import com.truckmitra.entity.user.User;
import com.truckmitra.enums.NotificationType;

public interface NotificationService {
    void sendNotification(User user, String title, String message, NotificationType type);
    void sendNotification(User user, String title, String message, NotificationType type, Long relatedId);
    void sendWhatsApp(String mobile, String message);
    void sendEmail(String email, String subject, String body);
    void sendEmailWithAttachment(String email, String subject, String body, String attachmentName, byte[] attachmentBytes);
}
