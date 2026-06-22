package com.truckmitra.controller;

import com.truckmitra.dto.request.ContactMessageRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.ContactMessage;
import com.truckmitra.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final ContactMessageRepository contactMessageRepository;

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<Void>> submitContactMessage(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        
        contactMessageRepository.save(message);

        return ResponseEntity.ok(ApiResponse.success("Message submitted successfully", null));
    }
}
