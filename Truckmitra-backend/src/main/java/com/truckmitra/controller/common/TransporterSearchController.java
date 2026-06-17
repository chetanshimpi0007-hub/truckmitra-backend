package com.truckmitra.controller.common;

import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class TransporterSearchController {

    private final UserRepository userRepository;

    @GetMapping("/transporters")
    @PreAuthorize("hasAnyRole('SHIPPER', 'ADMIN')")
    public ResponseEntity<List<User>> searchTransporters(@RequestParam(required = false) String query) {
        List<User> transporters = userRepository.findAll().stream()
            .filter(u -> u.getRole() == Role.TRANSPORTER)
            .filter(u -> u.getAccountStatus() == AccountStatus.VERIFIED)
            .filter(u -> query == null || 
                         (u.getFullName() != null && u.getFullName().toLowerCase().contains(query.toLowerCase())) ||
                         (u.getMobile() != null && u.getMobile().contains(query)))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(transporters);
    }
}
