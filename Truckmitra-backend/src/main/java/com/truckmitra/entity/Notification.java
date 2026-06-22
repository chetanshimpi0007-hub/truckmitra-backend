package com.truckmitra.entity;

import com.truckmitra.enums.NotificationType;

import com.truckmitra.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String message;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(name = "readstatus", nullable = false, columnDefinition = "boolean default false")
    private boolean isRead = false;

    @Column(name = "related_id")
    private Long relatedId; // e.g. loadId, tripId

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
