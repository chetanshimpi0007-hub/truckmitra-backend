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
    
    @Column(name = "userid", nullable = false)
    private Long userId;
    
    @Column(name = "recipientaddress", nullable = false)
    private String recipientAddress; // Email ya Phone number
    
    @Enumerated(EnumType.STRING)
    @Column(name = "channeltype", nullable = false)
    private ChannelType channelType;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(name = "contentbody", columnDefinition = "TEXT", nullable = false)
    private String contentBody;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;
    
    @Column(name = "errormessage")
    private String errorMessage;
    
    @Column(name = "retrycount")
    private Integer retryCount;
    
    @Column(name = "sentat")
    private LocalDateTime sentAt;
    
    @Column(name = "deliveredat")
    private LocalDateTime deliveredAt;
    
    @Column(name = "templatename", nullable = false)
    private String templateName;
}