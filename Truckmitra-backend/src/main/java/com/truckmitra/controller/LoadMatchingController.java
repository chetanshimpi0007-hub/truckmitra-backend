package com.truckmitra.controller;

import com.truckmitra.dto.RecommendationDTO;
import com.truckmitra.entity.user.TransporterPreference;
import com.truckmitra.entity.user.User;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.security.SecurityUtils;
import com.truckmitra.service.LoadMatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class LoadMatchingController {

    private final LoadMatchingService loadMatchingService;
    private final UserRepository userRepository;

    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('TRANSPORTER')")
    public ResponseEntity<List<RecommendationDTO>> getRecommendations() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<RecommendationDTO> recs = loadMatchingService.getRecommendationsForTransporter(userId);
        return ResponseEntity.ok(recs);
    }

    @GetMapping("/recommendations/{loadId}")
    @PreAuthorize("hasAnyRole('SHIPPER', 'ADMIN')")
    public ResponseEntity<List<RecommendationDTO>> getRecommendationsForLoad(@PathVariable Long loadId) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<RecommendationDTO> recs = loadMatchingService.getRecommendationsForLoad(loadId, userId);
        return ResponseEntity.ok(recs);
    }

    @PostMapping("/preferences")
    @PreAuthorize("hasRole('TRANSPORTER')")
    public ResponseEntity<TransporterPreference> createPreference(@RequestBody TransporterPreference preference) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        TransporterPreference saved = loadMatchingService.saveOrUpdatePreference(userId, preference);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/preferences")
    @PreAuthorize("hasRole('TRANSPORTER')")
    public ResponseEntity<TransporterPreference> updatePreference(@RequestBody TransporterPreference preference) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        TransporterPreference saved = loadMatchingService.saveOrUpdatePreference(userId, preference);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/preferences")
    @PreAuthorize("hasRole('TRANSPORTER')")
    public ResponseEntity<TransporterPreference> getPreference() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            TransporterPreference preference = loadMatchingService.getPreference(userId);
            return ResponseEntity.ok(preference);
        } catch (Exception e) {
            // Return empty or new preference data if not found rather than 500 error
            return ResponseEntity.ok(TransporterPreference.builder().transporterId(userId).active(true).build());
        }
    }
}
