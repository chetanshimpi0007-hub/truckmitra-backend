package com.truckmitra.service.notification;

import com.truckmitra.dto.request.NotificationRequest;
import com.truckmitra.enums.ChannelType;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class WhatsAppProvider implements NotificationProvider {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isEmpty()) {
            Twilio.init(accountSid, authToken);
        }
    }

    @Override
    public void send(NotificationRequest request) {
        try {
            String to = request.recipientAddress();
            // WhatsApp format requires whatsapp: prefix
            if (!to.startsWith("whatsapp:")) {
                to = "whatsapp:" + to;
            }
            String from = fromNumber;
            if (!from.startsWith("whatsapp:")) {
                from = "whatsapp:" + from;
            }

            String body = (String) request.templateData().get("message");
            if (body == null) body = request.subject();

            Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(from),
                    body
            ).create();
            
            log.info("WhatsApp notification sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send WhatsApp notification: {}", e.getMessage());
            throw new RuntimeException("WhatsApp failed: " + e.getMessage());
        }
    }

    @Override
    public ChannelType getChannelType() {
        return ChannelType.WHATSAPP;
    }
}
