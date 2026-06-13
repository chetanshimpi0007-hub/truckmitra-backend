package com.truckmitra.controller;

import com.truckmitra.service.fleet.FreightCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calculator")
@RequiredArgsConstructor
public class FreightCalculatorController {

    private final FreightCalculatorService calculatorService;

    @PostMapping("/calculate")
    public ResponseEntity<FreightCalculatorService.FreightResponse> calculate(@RequestBody FreightCalculatorService.FreightRequest request) {
        return ResponseEntity.ok(calculatorService.calculate(request));
    }
}
