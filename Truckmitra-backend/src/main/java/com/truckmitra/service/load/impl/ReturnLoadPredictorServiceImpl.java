package com.truckmitra.service.load.impl;

import com.truckmitra.dto.response.ReturnLoadSuggestionResponse;
import com.truckmitra.entity.load.Load;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.common.enums.TripStatus;
import com.truckmitra.exception.AppExceptions.UnauthorizedActionException;
import com.truckmitra.repository.LoadRepository;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.service.load.ReturnLoadPredictorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReturnLoadPredictorServiceImpl implements ReturnLoadPredictorService {

    private final TripRepository tripRepository;
    private final LoadRepository loadRepository;

    @Override
    public List<ReturnLoadSuggestionResponse> getSuggestions(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        // Validate Ownership
        if (!isAdmin) {
            boolean isDriver = trip.getVehicle() != null && trip.getVehicle().getDriver() != null &&
                    trip.getVehicle().getDriver().getEmail().equals(currentUsername);
            boolean isTransporter = trip.getTransporter() != null &&
                    trip.getTransporter().getEmail().equals(currentUsername);

            if (!isDriver && !isTransporter) {
                throw new UnauthorizedActionException("You are not authorized to view suggestions for this trip");
            }
        }

        if (trip.getStatus() != TripStatus.COMPLETED) {
            throw new RuntimeException("Trip must be completed to get return load suggestions");
        }

        // Extract Delivery City
        String destination = trip.getDestination();
        String deliveryCity = destination != null && destination.contains(",") 
                ? destination.split(",")[0].trim() 
                : destination;

        if (deliveryCity == null || deliveryCity.isEmpty()) {
            return List.of();
        }

        List<Load> loads = loadRepository.findReturnLoadSuggestions(deliveryCity, PageRequest.of(0, 10));

        return loads.stream().map(load -> ReturnLoadSuggestionResponse.builder()
                .loadId(load.getId())
                .sourceCity(load.getSource())
                .destinationCity(load.getDestination())
                .material(load.getMaterialType())
                .weight(load.getWeight())
                .shipperAmount(load.getBudget()) // Budget for open loads
                .loadStatus(load.getStatus())
                .createdAt(load.getCreatedAt())
                .build()).collect(Collectors.toList());
    }
}
