// src/main/java/com/truckmitra/repository/notification/NotificationLogRepository.java
package com.truckmitra.repository.notification;

import com.truckmitra.entity.notification.NotificationLog;
import com.truckmitra.enums.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    
    Page<NotificationLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    List<NotificationLog> findByStatusAndCreatedAtBefore(NotificationStatus status, LocalDateTime time);
    
    @Modifying
    @Query("UPDATE NotificationLog n SET n.status = :status WHERE n.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") NotificationStatus status);
    
    long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime since);
}