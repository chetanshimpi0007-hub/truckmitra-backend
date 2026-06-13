// src/main/java/com/truckmitra/controller/LoadController.java
package com.truckmitra.controller;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.dto.request.LoadRequest;
import com.truckmitra.entity.common.enums.LoadStatus;
import com.truckmitra.entity.load.Load;
import com.truckmitra.entity.user.User;
import com.truckmitra.service.LoadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.userdetails.UserDetails;
import com.truckmitra.repository.auth.UserRepository;


import java.util.List;

@RestController
@RequestMapping("/api/loads")
@RequiredArgsConstructor
public class LoadController {
    

    private final LoadService loadService;
     private final UserRepository userRepository;
@PostMapping
public ResponseEntity<Load> createLoad(
        @RequestBody LoadRequest request,
        @AuthenticationPrincipal UserDetails userDetails) {

    User user = userRepository.findByMobile(userDetails.getUsername())
            .orElseGet(() ->
                    userRepository.findByEmail(userDetails.getUsername())
                            .orElse(null));

    if (user == null) {
        throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("User profile not found for the given token.");
    }

    return ResponseEntity.ok(
            loadService.createLoad(request, user)
    );
}

    @PutMapping("/{id}")
    public ResponseEntity<Load> updateLoad(@PathVariable Long id, @RequestBody LoadRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElse(null));
        
        if (user == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(loadService.updateLoad(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoad(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElse(null));
        
        if (user == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }
        
        loadService.deleteLoad(id, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/shipper")
    public ResponseEntity<List<Load>> getShipperLoads(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElse(null));
        return ResponseEntity.ok(loadService.getShipperLoads(user));
    }

    @GetMapping("/transporter/{transporterId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN') or (hasRole('TRANSPORTER') and @userSecurity.isIdMatch(#transporterId))")
    public ResponseEntity<List<Load>> getTransporterLoads(@PathVariable Long transporterId) {
        return ResponseEntity.ok(loadService.getTransporterLoads(transporterId));
    }

    /**
     * Public-ish endpoint used by the Transporter marketplace.
     * e.g. GET /api/loads/status/PENDING?isBiddingEnabled=true
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getLoadsByStatus(
            @PathVariable String status,
            @RequestParam(required = false) Boolean isBiddingEnabled) {
        Long userId = com.truckmitra.security.SecurityUtils.getCurrentUserId();
        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                if (user.getRole() == com.truckmitra.entity.common.enums.Role.TRANSPORTER && 
                    (user.getIsVerified() == null || !user.getIsVerified())) {
                    throw new com.truckmitra.exception.AppExceptions.UnauthorizedActionException("Your transporter account is not verified by admin.");
                }
            });
        }
        LoadStatus loadStatus = LoadStatus.valueOf(status.toUpperCase());
        List<Load> loads = (isBiddingEnabled != null)
                ? loadService.getLoadsByStatusAndBidding(loadStatus, isBiddingEnabled)
                : loadService.getLoadsByStatus(loadStatus);
        return ResponseEntity.ok(loads);
    }

    @PostMapping("/{loadId}/assign/{transporterId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('SHIPPER') or hasRole('ADMIN')")
    public ResponseEntity<Load> assignTransporter(
            @PathVariable Long loadId, 
            @PathVariable Long transporterId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepository.findByMobile(userDetails.getUsername())
                .orElseGet(() -> userRepository.findByEmail(userDetails.getUsername()).orElse(null));
        
        if (user == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }
        
        // The service should check if the 'user' is actually the owner of 'loadId'
        return ResponseEntity.ok(loadService.assignTransporter(loadId, transporterId));
    }
}

