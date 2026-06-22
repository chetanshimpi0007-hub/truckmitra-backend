// src/main/java/com/truckmitra/entity/notification/NotificationLog.java
package com.truckmitra.entity.notification;

import jakarta.persistence.Column;
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
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "recipient_address", nullable = false)
    private String recipientAddress; // Email ya Phone number
    
    @Enumerated(EnumType.STRING)
    @Column(name = "channel_type", nullable = false)
    private ChannelType channelType;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(name = "content_body", columnDefinition = "TEXT", nullable = false)
    private String contentBody;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "retry_count")
    private Integer retryCount;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
    
    @Column(name = "template_name", nullable = false)
    private String templateName;
}