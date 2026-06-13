// src/main/java/com/truckmitra/service/notification/NotificationProvider.java
package com.truckmitra.service.notification;

import com.truckmitra.dto.request.NotificationRequest;
import com.truckmitra.enums.ChannelType;

public interface NotificationProvider {
    ChannelType getChannelType();
    void send(NotificationRequest request) throws Exception;
}