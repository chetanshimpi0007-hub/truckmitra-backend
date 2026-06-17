package com.truckmitra.controller.load;

import com.truckmitra.dto.response.FuelProfitCalculationResponse;
import com.truckmitra.service.load.FuelProfitCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FuelProfitController {

    private final FuelProfitCalculatorService fuelProfitCalculatorService;

    @GetMapping("/loads/{id}/profit-estimate")
    public ResponseEntity<FuelProfitCalculationResponse> getLoadProfitEstimate(@PathVariable Long id) {
        return ResponseEntity.ok(fuelProfitCalculatorService.calculateForLoad(id));
    }

    @GetMapping("/trips/{id}/profit-estimate")
    public ResponseEntity<FuelProfitCalculationResponse> getTripProfitEstimate(@PathVariable Long id) {
        return ResponseEntity.ok(fuelProfitCalculatorService.calculateForTrip(id));
    }
}
