package com.truckmitra.service.fleet;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FreightCalculatorService {

    private final RouteOptimizerService routeOptimizerService;

    @Data
    public static class FreightRequest {
        private double distance; // in KM
        private double dieselPrice;
        private double mileage; // KM per Liter
        private double driverCharges;
        private double tollCharges;
        private double otherCharges;
        private double marginPercent;
    }

    @Data
    public static class FreightResponse {
        private double fuelCost;
        private double baseCost;
        private double totalCost;
        private double recommendedBid;
        private double estimatedProfit;
    }

    public FreightResponse calculate(FreightRequest req) {
        double fuelRequired = req.getDistance() / req.getMileage();
        double fuelCost = fuelRequired * req.getDieselPrice();
        
        double tolls = req.getTollCharges();
        if (tolls <= 0) {
            tolls = routeOptimizerService.calculateTolls(req.getDistance());
        }
        
        double baseCost = fuelCost + req.getDriverCharges() + tolls + req.getOtherCharges();
        double marginAmount = baseCost * (req.getMarginPercent() / 100);
        
        FreightResponse res = new FreightResponse();
        res.setFuelCost(Math.round(fuelCost * 100.0) / 100.0);
        res.setBaseCost(Math.round(baseCost * 100.0) / 100.0);
        res.setTotalCost(Math.round(baseCost * 100.0) / 100.0);
        res.setRecommendedBid(Math.round((baseCost + marginAmount) * 100.0) / 100.0);
        res.setEstimatedProfit(Math.round(marginAmount * 100.0) / 100.0);
        
        return res;
    }
}
