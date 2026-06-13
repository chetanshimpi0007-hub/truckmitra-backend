package com.truckmitra.controller;

import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.repository.user.TransporterRepository;
import com.truckmitra.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transporters")
@RequiredArgsConstructor
public class TransporterController {

    private final TransporterRepository transporterRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Transporter>> getMe() {
        Long userId = SecurityUtils.getCurrentUserId();
        return transporterRepository.findById(userId)
                .map(t -> ResponseEntity.ok(ApiResponse.success("Transporter fetched", t)))
                .orElseGet(() -> ResponseEntity.ok(ApiResponse.success("Not found", null)));
    }
}
