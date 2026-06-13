package com.truckmitra.aspect;

import com.truckmitra.service.notification.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
public class NotificationAspect {
    private static final Logger log = LoggerFactory.getLogger(NotificationAspect.class);

    @Autowired
    private NotificationService notificationService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Disabled: explicit forwarding will be used instead of broad pointcuts
    private final boolean enabled = false;

    @Pointcut("execution(* com.truckmitra..*.accept*(..))")
    public void acceptMethods() {}

    @Pointcut("execution(* com.truckmitra..*.update*(..))")
    public void updateMethods() {}

    @Pointcut("execution(* com.truckmitra..*.complete*(..))")
    public void completeMethods() {}

    // After business methods used before; now no-op to avoid duplicate notifications
   public void afterBusinessMethod(JoinPoint jp, Object ret) {
        if (!enabled) return;
        try {
            String method = jp.getSignature().getName();
            Object[] args = jp.getArgs();

            Map<String, Object> payload = new HashMap<>();
            payload.put("event", method);
            payload.put("args", args);
            payload.put("result", ret);
            payload.put("source", "backend");

            // Send to socket relay via NotificationService
            notificationService.forwardNotifyToSocket(payload);
        } catch (Exception e) {
            log.warn("NotificationAspect forwarding failed: {}", e.getMessage());
        }
    }
}
