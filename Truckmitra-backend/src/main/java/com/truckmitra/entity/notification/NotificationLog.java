// src/main/java/com/truckmitra/entity/notification/NotificationLog.java
package com.truckmitra.entity.notification;

import com.truckmitra.entity.common.BaseEntity;
import com.truckmitra.enums.ChannelType;
import com.truckmitra.enums.NotificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification_logs", 
       indexes = {
           @Index(name = "idx_notif_log_user_id", columnList = "userId"),
           @Index(name = "idx_notification_status", columnList = "status"),
           @Index(name = "idx_created_at", columnList = "created_at")
       })
public class NotificationLog extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private String recipientAddress; // Email ya Phone number
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChannelType channelType;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String contentBody;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;
    
    private String errorMessage;
    
    private Integer retryCount;
    
    private LocalDateTime sentAt;
    
    private LocalDateTime deliveredAt;
    
    @Column(nullable = false)
    private String templateName;
}