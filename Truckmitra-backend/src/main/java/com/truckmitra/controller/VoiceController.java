package com.truckmitra.controller;

import com.truckmitra.dto.request.VoiceLoadParseRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.VoiceLoadParseResponse;
import com.truckmitra.service.load.VoiceLoadParserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/voice")
@RequiredArgsConstructor
public class VoiceController {

    private final VoiceLoadParserService voiceLoadParserService;

    @PostMapping("/parse-load")
    @PreAuthorize("hasRole('SHIPPER') or hasRole('TRANSPORTER')")
    public ResponseEntity<ApiResponse<VoiceLoadParseResponse>> parseLoadTranscript(@Valid @RequestBody VoiceLoadParseRequest request) {
        VoiceLoadParseResponse response = voiceLoadParserService.parseLoadTranscript(request);
        return ResponseEntity.ok(ApiResponse.success("Parsed voice transcript successfully", response));
    }
}
