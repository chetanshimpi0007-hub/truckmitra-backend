package com.truckmitra.service.common;

import com.truckmitra.entity.AuditLog;
import com.truckmitra.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @org.springframework.transaction.annotation.Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void log(String action, String module, String details, Long userId) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .module(module)
                .details(details)
                .userId(userId)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }

    @org.springframework.transaction.annotation.Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void logAction(String action, String details, com.truckmitra.entity.user.User user) {
        log(action, "BUSINESS", details, user.getId());
    }
}
