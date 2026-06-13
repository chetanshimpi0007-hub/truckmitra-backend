// src/main/java/com/truckmitra/service/notification/NotificationFactory.java
package com.truckmitra.service.notification;

import com.truckmitra.enums.ChannelType;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class NotificationFactory {
    
    private final List<NotificationProvider> providers;
    private Map<ChannelType, NotificationProvider> providerMap;
    
    @PostConstruct
    public void init() {
        providerMap = new EnumMap<>(ChannelType.class);
        providers.forEach(provider -> 
            providerMap.put(provider.getChannelType(), provider)
        );
    }
    
    public NotificationProvider getProvider(ChannelType channelType) {
        NotificationProvider provider = providerMap.get(channelType);
        if (provider == null) {
            throw new IllegalArgumentException("No provider found for channel: " + channelType);
        }
        return provider;
    }
}