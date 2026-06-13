// src/main/java/com/truckmitra/dto/response/NotificationResponse.java
package com.truckmitra.dto.response;

import com.truckmitra.enums.ChannelType;
import com.truckmitra.enums.NotificationStatus;

import java.time.LocalDateTime;

public record NotificationResponse(
    Long id,
    Long userId,
    String recipientAddress,
    ChannelType channelType,
    String subject,
    NotificationStatus status,
    LocalDateTime sentAt,
    LocalDateTime createdAt
) {}