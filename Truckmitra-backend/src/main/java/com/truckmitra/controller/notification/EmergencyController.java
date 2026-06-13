package com.truckmitra.controller.notification;

import com.truckmitra.entity.notification.EmergencyAlert;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.notification.EmergencyAlertRepository;
import com.truckmitra.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmergencyController {

    private final EmergencyAlertRepository emergencyAlertRepository;
    private final UserRepository userRepository;

    @PostMapping("/sos")
    public ResponseEntity<EmergencyAlert> triggerSos(@RequestBody Map<String, Object> payload) {
        Long driverId = Long.valueOf(payload.get("driverId").toString());
        Double lat = Double.valueOf(payload.get("latitude").toString());
        Double lng = Double.valueOf(payload.get("longitude").toString());

        User driver = userRepository.findById(driverId).orElseThrow();

        EmergencyAlert alert = EmergencyAlert.builder()
                .driver(driver)
                .latitude(lat)
                .longitude(lng)
                .status("ACTIVE")
                .build();

        // Normally here we would integrate Twilio or SendGrid to send direct SMS to Admins
        return ResponseEntity.ok(emergencyAlertRepository.save(alert));
    }

    @GetMapping("/active")
    public ResponseEntity<List<EmergencyAlert>> getActiveAlerts() {
        return ResponseEntity.ok(emergencyAlertRepository.findAll().stream().filter(a -> "ACTIVE".equals(a.getStatus())).toList());
    }
}
