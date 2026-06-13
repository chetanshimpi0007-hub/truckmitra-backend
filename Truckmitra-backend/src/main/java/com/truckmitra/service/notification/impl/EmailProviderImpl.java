// src/main/java/com/truckmitra/service/notification/impl/EmailProviderImpl.java
package com.truckmitra.service.notification.impl;

import com.truckmitra.dto.request.NotificationRequest;
import com.truckmitra.enums.ChannelType;
import com.truckmitra.service.notification.NotificationProvider;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailProviderImpl implements NotificationProvider {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public ChannelType getChannelType() {
        return ChannelType.EMAIL;
    }

    @Override
    public void send(NotificationRequest request) throws Exception {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(request.recipientAddress());
            
            // Set subject
            String subject = request.subject() != null ? 
                request.subject() : "TruckMitra Notification";
            helper.setSubject(subject);
            
            // Process template
            Context context = new Context();
            if (request.templateData() != null) {
                context.setVariables(request.templateData());
            }
            
            String htmlContent = templateEngine.process(
                request.template().getTemplateName(), 
                context
            );
            helper.setText(htmlContent, true);
            
            // Send email
            mailSender.send(message);
            log.info("Email sent successfully to: {}", request.recipientAddress());
            
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", request.recipientAddress(), e);
            throw new Exception("Email sending failed: " + e.getMessage());
        }
    }
}