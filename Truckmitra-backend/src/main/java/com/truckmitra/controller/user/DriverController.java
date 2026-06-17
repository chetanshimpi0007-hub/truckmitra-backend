package com.truckmitra.controller.user;

import com.truckmitra.dto.request.auth.RegisterRequest;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.common.enums.VehicleType;
import com.truckmitra.entity.user.Driver;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.entity.wallet.Wallet;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.repository.user.TransporterRepository;
import com.truckmitra.repository.wallet.WalletRepository;
import com.truckmitra.repository.fleet.VehicleRepository;
import com.truckmitra.entity.fleet.Vehicle;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.truckmitra.security.SecurityUtils;
import com.truckmitra.service.user.DriverAvailabilityService;
import com.truckmitra.dto.response.DriverAvailabilitySummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverRepository driverRepository;
    private final TransporterRepository transporterRepository;
    private final PasswordEncoder passwordEncoder;
    private final WalletRepository walletRepository;
    private final VehicleRepository vehicleRepository;
    private final com.truckmitra.service.common.SubscriptionService subscriptionService;
    private final DriverAvailabilityService driverAvailabilityService;

    /** Returns all drivers linked to a transporter (including pending ones). */
    @GetMapping("/transporter/{transporterId}")
    public ResponseEntity<List<Driver>> getDriversForTransporter(@PathVariable Long transporterId) {
        Transporter transporter = transporterRepository.findById(transporterId)
                .orElseThrow(() -> new RuntimeException("Transporter not found"));
        List<Driver> drivers = driverRepository.findAllById(transporter.getDriverIds());
        return ResponseEntity.ok(drivers);
    }

        /** Returns drivers for the authenticated transporter (uses current auth user). */
        @GetMapping("/me")
        public ResponseEntity<List<Driver>> getMyDrivers() {
                // Fetch ALL drivers and filter for Admin-approved (VERIFIED)
                List<Driver> drivers = driverRepository.findAll();
                List<Driver> approvedDrivers = drivers.stream()
                        .filter(d -> d.getAccountStatus() == AccountStatus.VERIFIED)
                        .collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok(approvedDrivers);
        }

        @GetMapping("/availability-summary")
        public ResponseEntity<DriverAvailabilitySummaryResponse> getAvailabilitySummary() {
                Long currentUserId = SecurityUtils.getCurrentUserId();
                return ResponseEntity.ok(driverAvailabilityService.getAvailabilitySummary(currentUserId));
        }

        @GetMapping("/available")
        public ResponseEntity<Page<Driver>> getAvailableDrivers(
                @RequestParam(required = false) String city,
                @RequestParam(required = false) String vehicleType,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "20") int size
        ) {
                Long currentUserId = SecurityUtils.getCurrentUserId();
                return ResponseEntity.ok(driverAvailabilityService.getAvailableDrivers(
                        currentUserId, city, vehicleType, PageRequest.of(page, size)
                ));
        }

    /**
     * Register a sub-driver under a transporter using the same full form data as
     * the public driver registration page.  The driver is saved with PENDING status
     * so the admin must approve the account before the driver can log in.
     */
    @PostMapping("/register-sub-driver")
    @Transactional
    public ResponseEntity<ApiResponse<Driver>> registerSubDriver(
            @RequestParam Long transporterId,
            @RequestBody RegisterRequest request) {

        Transporter transporter = transporterRepository.findById(transporterId)
                .orElseThrow(() -> new RuntimeException("Transporter not found"));

        if (false) {
            throw new RuntimeException("Driver limit reached for your current subscription. Please upgrade.");
        }

        Driver driver = new Driver();

        // ── Basic info ────────────────────────────────────────────────────────
        driver.setFullName(request.fullName());
        driver.setMobile(request.mobile());

        String email = request.email();
        driver.setEmail((email != null && !email.trim().isEmpty()) ? email.trim() : null);

        String rawPwd = request.password();
        driver.setPassword(passwordEncoder.encode(
                (rawPwd == null || rawPwd.trim().isEmpty()) ? "12345678" : rawPwd));

        driver.setRole(Role.DRIVER);
        // PENDING_VERIFICATION – admin must approve before the driver can log in
        driver.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
        driver.setTransporterId(transporterId);
        driver.setPreferredLoginType("EMAIL_PASSWORD");
        driver.setIsMobileVerified(true);
        driver.setRegisteredAt(LocalDateTime.now());

        // ── Address ───────────────────────────────────────────────────────────
        driver.setAddress(request.address());
        driver.setLandmark(request.landmark());
        driver.setArea(request.area());
        driver.setCity(request.city());
        driver.setState(request.state());
        driver.setPincode(request.pincode());

        // ── Identity documents ────────────────────────────────────────────────
        driver.setAadhaarNumber(request.aadhaarNumber());
        driver.setAadhaarFrontImageUrl(request.aadhaarFrontImageUrl());
        driver.setAadhaarBackImageUrl(request.aadhaarBackImageUrl());
        driver.setPanNumber(request.panNumber());
        driver.setPanCardImageUrl(request.panCardImageUrl());

        // ── Driving licence ───────────────────────────────────────────────────
        driver.setDrivingLicenseNumber(request.drivingLicenseNumber());
        if (request.licenseExpiryDate() != null && !request.licenseExpiryDate().isBlank()) {
            driver.setLicenseExpiryDate(java.time.LocalDate.parse(request.licenseExpiryDate()));
        }
        driver.setDrivingLicenseImageUrl(request.licenseImageUrl());

        // ── Vehicle ───────────────────────────────────────────────────────────
        driver.setVehicleNumber(request.vehicleNumber());
        driver.setVehicleCapacity(request.vehicleCapacity());
        driver.setVehiclePucImageUrl(request.vehiclePucImageUrl());
        driver.setVehicleFrontImageUrl(request.vehicleFrontImageUrl());
        driver.setVehicleBackImageUrl(request.vehicleBackImageUrl());
        driver.setVehicleInsuranceImageUrl(request.vehicleInsuranceImageUrl());
        driver.setVehicleFuelType(request.vehicleFuelType());

        if (request.preferredVehicleType() != null && !request.preferredVehicleType().isBlank()) {
            try {
                driver.setPreferredVehicleType(VehicleType.valueOf(request.preferredVehicleType()));
            } catch (IllegalArgumentException ignored) { /* Unknown enum value – skip */ }
        }

        // ── Emergency contact ─────────────────────────────────────────────────
        driver.setEmergencyContactName(request.emergencyContactName());
        driver.setEmergencyContactNumber(request.emergencyContactNumber());

        // ── Defaults ──────────────────────────────────────────────────────────
        driver.setIsAvailable(false); // Not available until admin approves
        driver.setIsOnTrip(false);
        driver.setTotalTripsCompleted(0);
        driver.setTotalEarnings(0.0);
        driver.setRating(0.0);
        driver.setTotalRatings(0);

        Driver savedDriver = driverRepository.save(driver);

        // Link driver to transporter's list so transporter can see pending driver
        transporter.addDriver(savedDriver.getId());
        
        // Auto-create Vehicle if vehicleNumber is provided
        if (request.vehicleNumber() != null && !request.vehicleNumber().trim().isEmpty()) {
            Double capacityVal = 1.0;
            if (request.vehicleCapacity() != null && !request.vehicleCapacity().trim().isEmpty()) {
                try {
                    String digits = request.vehicleCapacity().replaceAll("[^0-9.]", "");
                    if (!digits.isEmpty()) {
                        capacityVal = Double.parseDouble(digits);
                    }
                } catch (Exception e) {
                    capacityVal = 1.0;
                }
            }

            Vehicle vehicle = Vehicle.builder()
                .vehicleNumber(request.vehicleNumber())
                .vehicleType(request.preferredVehicleType() != null && !request.preferredVehicleType().trim().isEmpty() ? request.preferredVehicleType() : "TRUCK")
                .capacity(capacityVal)
                .vehicleFrontImageUrl(request.vehicleFrontImageUrl())
                .vehicleBackImageUrl(request.vehicleBackImageUrl())
                .vehicleRcImageUrl(request.vehicleInsuranceImageUrl()) // Mapping roughly since there's no explicit RC in signup payload
                .transporter(transporter)
                .driver(savedDriver)
                .isAvailable(true)
                .isDeleted(false)
                .isActive(true)
                .build();
            Vehicle savedVehicle = vehicleRepository.save(vehicle);
            transporter.addVehicle(savedVehicle.getId());
        }

        transporterRepository.save(transporter);

        // Create a wallet for the new driver
        String walletNumber = "WALDR" + savedDriver.getId()
                + String.valueOf(System.currentTimeMillis()).substring(7)
                + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        Wallet wallet = Wallet.builder()
                .userId(savedDriver.getId())
                .userRole("DRIVER")
                .walletNumber(walletNumber)
                .currentBalance(BigDecimal.ZERO)
                .escrowBalance(BigDecimal.ZERO)
                .lifetimeDeposit(BigDecimal.ZERO)
                .lifetimeWithdrawal(BigDecimal.ZERO)
                .lifetimeEarnings(BigDecimal.ZERO)
                .lifetimeSpent(BigDecimal.ZERO)
                .walletStatus("ACTIVE")
                .dailyTransactionCount(0)
                .dailyTransactionLimit(new BigDecimal("100000"))
                .perTransactionLimit(new BigDecimal("50000"))
                .isPinSet(false)
                .build();
        walletRepository.save(wallet);

        return ResponseEntity.ok(ApiResponse.success(
                "Driver registration submitted. Awaiting admin approval.", savedDriver));
    }
}
