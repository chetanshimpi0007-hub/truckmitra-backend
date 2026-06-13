// src/main/java/com/truckmitra/service/notification/impl/SmsProviderImpl.java
package com.truckmitra.service.notification.impl;

import com.truckmitra.dto.request.NotificationRequest;
import com.truckmitra.enums.ChannelType;
import com.truckmitra.service.notification.NotificationProvider;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SmsProviderImpl implements NotificationProvider {

    // Fix: Use the property names from your application.properties
    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.phone.number:}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isEmpty() && 
            authToken != null && !authToken.isEmpty()) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio initialized successfully with SID: {}", accountSid);
        } else {
            log.warn("Twilio credentials not configured. SMS will be logged only.");
        }
    }

    @Override
    public ChannelType getChannelType() {
        return ChannelType.SMS;
    }

    @Override
    public void send(NotificationRequest request) throws Exception {
        String message = (String) request.templateData().get("message");
        String toNumber = request.recipientAddress();
        
        log.info("Sending SMS to: {}, message: {}", toNumber, message);
        
        // If Twilio is configured, send actual SMS
        if (accountSid != null && !accountSid.isEmpty() && 
            authToken != null && !authToken.isEmpty() &&
            fromNumber != null && !fromNumber.isEmpty()) {
            
            try {
                Message twilioMessage = Message.creator(
                    new PhoneNumber(toNumber),
                    new PhoneNumber(fromNumber),
                    message
                ).create();
                
                log.info("SMS sent successfully, SID: {}", twilioMessage.getSid());
            } catch (Exception e) {
                log.error("Failed to send SMS via Twilio: {}", e.getMessage());
                throw new Exception("SMS sending failed: " + e.getMessage());
            }
        } else {
            // Log mode for development
            log.info("SMS [TO: {}, FROM: {}, BODY: {}]", toNumber, fromNumber, message);
        }
    }
}