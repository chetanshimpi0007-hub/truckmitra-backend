package com.truckmitra.repository.notification;

import com.truckmitra.entity.notification.EmergencyAlert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmergencyAlertRepository extends JpaRepository<EmergencyAlert, Long> {
}
