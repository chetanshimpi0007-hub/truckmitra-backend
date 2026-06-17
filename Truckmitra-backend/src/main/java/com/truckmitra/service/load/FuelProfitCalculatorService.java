package com.truckmitra.service.load;

import com.truckmitra.dto.response.FuelProfitCalculationResponse;

public interface FuelProfitCalculatorService {
    FuelProfitCalculationResponse calculateForLoad(Long loadId);
    FuelProfitCalculationResponse calculateForTrip(Long tripId);
}
