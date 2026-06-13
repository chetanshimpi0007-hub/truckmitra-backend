package com.truckmitra.controller;

import com.truckmitra.dto.request.auth.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestJsonController {

    @PostMapping("/api/test-json")
    public ResponseEntity<String> testJson(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok("vehicleNumber: " + request.vehicleNumber() + ", fullName: " + request.fullName());
    }
}
