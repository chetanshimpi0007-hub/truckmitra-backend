// src/main/java/com/truckmitra/dto/request/NotificationRequest.java
package com.truckmitra.dto.request;

import com.truckmitra.enums.ChannelType;
import com.truckmitra.enums.NotificationTemplate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record NotificationRequest(
    @NotNull(message = "User ID is required")
    Long userId,
    
    @NotBlank(message = "Recipient address is required")
    String recipientAddress,
    
    @NotNull(message = "Channel type is required")
    ChannelType channelType,
    
    @NotNull(message = "Template is required")
    NotificationTemplate template,
    
    Map<String, Object> templateData,  // Dynamic data for template
    
    String subject  // Optional, agar override karna ho
) {}