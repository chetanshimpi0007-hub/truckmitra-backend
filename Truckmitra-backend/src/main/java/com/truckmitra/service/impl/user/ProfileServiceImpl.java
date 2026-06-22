// src/main/java/com/truckmitra/service/impl/user/ProfileServiceImpl.java
package com.truckmitra.service.impl.user;

import com.truckmitra.dto.request.user.DriverProfileUpdateRequest;
import com.truckmitra.dto.request.user.ShipperProfileUpdateRequest;
import com.truckmitra.dto.request.user.TransporterProfileUpdateRequest;
import com.truckmitra.dto.response.user.DriverProfileResponse;
import com.truckmitra.dto.response.user.ShipperProfileResponse;
import com.truckmitra.dto.response.user.TransporterProfileResponse;
import com.truckmitra.entity.common.enums.VehicleType;
import com.truckmitra.entity.user.*;
import com.truckmitra.entity.wallet.Wallet;
import com.truckmitra.exception.ResourceNotFoundException;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.repository.user.ShipperRepository;
import com.truckmitra.repository.user.TransporterRepository;
import com.truckmitra.repository.wallet.WalletRepository;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.service.user.ProfileService;
import com.truckmitra.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final ShipperRepository shipperRepository;
    private final TransporterRepository transporterRepository;
    private final WalletRepository walletRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public DriverProfileResponse getDriverProfile(Long driverId) {
        log.info("Fetching driver profile: {}", driverId);
        
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", driverId));
        
        Wallet wallet = walletRepository.findByUserIdAndUserRole(driverId, "DRIVER")
                .orElse(null);

        return mapToDriverProfile(driver, wallet);
    }

    @Override
    public ShipperProfileResponse getShipperProfile(Long shipperId) {
        log.info("Fetching shipper profile: {}", shipperId);
        
        Shipper shipper = shipperRepository.findById(shipperId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipper", "id", shipperId));
        
        Wallet wallet = walletRepository.findByUserIdAndUserRole(shipperId, "SHIPPER")
                .orElse(null);

        return mapToShipperProfile(shipper, wallet);
    }

    @Override
    public TransporterProfileResponse getTransporterProfile(Long transporterId) {
        log.info("Fetching transporter profile: {}", transporterId);
        
        Transporter transporter = transporterRepository.findById(transporterId)
                .orElseThrow(() -> new ResourceNotFoundException("Transporter", "id", transporterId));
        
        Wallet wallet = walletRepository.findByUserIdAndUserRole(transporterId, "TRANSPORTER")
                .orElse(null);

        return mapToTransporterProfile(transporter, wallet);
    }

    @Override
    public DriverProfileResponse updateDriverProfile(Long driverId, DriverProfileUpdateRequest request) {
        log.info("Updating driver profile: {}", driverId);
        
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", driverId));

        // Update basic info
        if (request.fullName() != null) driver.setFullName(request.fullName());
        if (request.email() != null) driver.setEmail(request.email());
        if (request.address() != null) driver.setAddress(request.address());
        if (request.city() != null) driver.setCity(request.city());
        if (request.state() != null) driver.setState(request.state());
        if (request.pincode() != null) driver.setPincode(request.pincode());

        // Update driver specific
        if (request.aadharNumber() != null) driver.setAadhaarNumber(request.aadharNumber());
        if (request.drivingLicenseNumber() != null) 
            driver.setDrivingLicenseNumber(request.drivingLicenseNumber());
        if (request.licenseExpiryDate() != null) 
            driver.setLicenseExpiryDate(request.licenseExpiryDate());
        if (request.preferredVehicleType() != null) 
            driver.setPreferredVehicleType(parseVehicleType(request.preferredVehicleType()));

        // Update emergency contact
        if (request.emergencyContactName() != null)
            driver.setEmergencyContactName(request.emergencyContactName());
        if (request.emergencyContactNumber() != null)
            driver.setEmergencyContactNumber(request.emergencyContactNumber());

        // Update bank details
        if (request.accountHolderName() != null)
            driver.setAccountHolderName(request.accountHolderName());
        if (request.bankName() != null)
            driver.setBankName(request.bankName());
        if (request.accountNumber() != null)
            driver.setAccountNumber(request.accountNumber());
        if (request.ifscCode() != null)
            driver.setIfscCode(request.ifscCode());
        if (request.upiId() != null)
            driver.setUpiId(request.upiId());

        Driver updatedDriver = driverRepository.save(driver);
        log.info("Driver profile updated successfully: {}", driverId);

        Wallet wallet = walletRepository.findByUserIdAndUserRole(driverId, "DRIVER").orElse(null);
        return mapToDriverProfile(updatedDriver, wallet);
    }

    @Override
    public ShipperProfileResponse updateShipperProfile(Long shipperId, ShipperProfileUpdateRequest request) {
        log.info("Updating shipper profile: {}", shipperId);
        
        Shipper shipper = shipperRepository.findById(shipperId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipper", "id", shipperId));

        if (request.fullName() != null) shipper.setFullName(request.fullName());
        if (request.authorizedPersonName() != null) shipper.setFullName(request.authorizedPersonName());
        if (request.email() != null) shipper.setEmail(request.email());
        if (request.address() != null) shipper.setAddress(request.address());
        if (request.registeredOfficeAddress() != null) shipper.setAddress(request.registeredOfficeAddress());
        if (request.city() != null) shipper.setCity(request.city());
        if (request.state() != null) shipper.setState(request.state());
        if (request.pincode() != null) shipper.setPincode(request.pincode());

        // Update business details
        if (request.companyName() != null) shipper.setCompanyName(request.companyName());
        if (request.gstNumber() != null) shipper.setGstNumber(request.gstNumber());
        if (request.companyPan() != null) shipper.setPanNumber(request.companyPan());
        if (request.businessType() != null) shipper.setBusinessType(request.businessType());
        if (request.industryType() != null) shipper.setIndustryType(request.industryType());

        // Update preferences
        if (request.pushNotificationsEnabled() != null)
            shipper.setPushNotificationsEnabled(request.pushNotificationsEnabled());
        if (request.emailNotificationsEnabled() != null)
            shipper.setEmailNotificationsEnabled(request.emailNotificationsEnabled());
        if (request.smsNotificationsEnabled() != null)
            shipper.setSmsNotificationsEnabled(request.smsNotificationsEnabled());

        Shipper updatedShipper = shipperRepository.save(shipper);
        log.info("Shipper profile updated successfully: {}", shipperId);

        Wallet wallet = walletRepository.findByUserIdAndUserRole(shipperId, "SHIPPER").orElse(null);
        return mapToShipperProfile(updatedShipper, wallet);
    }

    @Override
    public TransporterProfileResponse updateTransporterProfile(Long transporterId, TransporterProfileUpdateRequest request) {
        log.info("Updating transporter profile: {}", transporterId);
        
        Transporter transporter = transporterRepository.findById(transporterId)
                .orElseThrow(() -> new ResourceNotFoundException("Transporter", "id", transporterId));

        if (request.fullName() != null) transporter.setFullName(request.fullName());
        if (request.ownerName() != null) transporter.setFullName(request.ownerName());
        if (request.email() != null) transporter.setEmail(request.email());
        if (request.address() != null) transporter.setAddress(request.address());
        if (request.officeAddress() != null) transporter.setAddress(request.officeAddress());
        if (request.city() != null) transporter.setCity(request.city());
        if (request.state() != null) transporter.setState(request.state());
        if (request.pincode() != null) transporter.setPincode(request.pincode());

        // Update business details
        if (request.agencyName() != null) transporter.setAgencyName(request.agencyName());
        if (request.gstNumber() != null) transporter.setGstNumber(request.gstNumber());
        if (request.panNumber() != null) transporter.setPanNumber(request.panNumber());
        if (request.officeAddress() != null) transporter.setOfficeAddress(request.officeAddress());
        if (request.fleetSize() != null) transporter.setFleetSize(request.fleetSize());
        if (request.serviceAreas() != null) transporter.setServiceAreas(request.serviceAreas());

        // Update preferences
        if (request.pushNotificationsEnabled() != null)
            transporter.setPushNotificationsEnabled(request.pushNotificationsEnabled());
        if (request.emailNotificationsEnabled() != null)
            transporter.setEmailNotificationsEnabled(request.emailNotificationsEnabled());
        if (request.smsNotificationsEnabled() != null)
            transporter.setSmsNotificationsEnabled(request.smsNotificationsEnabled());

        Transporter updatedTransporter = transporterRepository.save(transporter);
        log.info("Transporter profile updated successfully: {}", transporterId);

        Wallet wallet = walletRepository.findByUserIdAndUserRole(transporterId, "TRANSPORTER").orElse(null);
        return mapToTransporterProfile(updatedTransporter, wallet);
    }

    @Override
    public String uploadProfileImage(Long userId, MultipartFile file) {
        log.info("Uploading profile image for user: {}", userId);
        
        // Validate file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        // Upload to storage (S3 or local)
        String imageUrl = cloudinaryService.uploadFile(file);
        
        // Update user profile image URL (need to find which type of user)
        // Try to find in each repository
        Driver driver = driverRepository.findById(userId).orElse(null);
        if (driver != null) {
            driver.setProfileImageUrl(imageUrl);
            driverRepository.save(driver);
            return imageUrl;
        }
        
        Shipper shipper = shipperRepository.findById(userId).orElse(null);
        if (shipper != null) {
            shipper.setProfileImageUrl(imageUrl);
            shipperRepository.save(shipper);
            return imageUrl;
        }
        
        Transporter transporter = transporterRepository.findById(userId).orElse(null);
        if (transporter != null) {
            transporter.setProfileImageUrl(imageUrl);
            transporterRepository.save(transporter);
            return imageUrl;
        }
        
        return imageUrl;
    }

    @Override
    public void uploadDriverDocuments(Long driverId, MultipartFile license, MultipartFile aadhaar) {
        log.info("Uploading documents for driver: {}", driverId);
        
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", driverId));

        // Upload license
        if (license != null && !license.isEmpty()) {
            String licenseUrl = cloudinaryService.uploadFile(license);
            driver.setDrivingLicenseImageUrl(licenseUrl);
        }

        // Upload aadhaar
        if (aadhaar != null && !aadhaar.isEmpty()) {
            String aadhaarUrl = cloudinaryService.uploadFile(aadhaar);
            driver.setAadhaarFrontImageUrl(aadhaarUrl);
        }

        driverRepository.save(driver);
        log.info("Documents uploaded successfully for driver: {}", driverId);
    }

    @Override
    public boolean toggleDriverAvailability(Long driverId) {
        log.info("Toggling availability for driver: {}", driverId);
        
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", driverId));

        // Can't toggle if on trip
        if (driver.getIsOnTrip()) {
            throw new IllegalStateException("Cannot change availability while on trip");
        }

        boolean newStatus = !driver.getIsAvailable();
        driver.setIsAvailable(newStatus);
        driverRepository.save(driver);

        log.info("Driver {} availability set to: {}", driverId, newStatus);
        return newStatus;
    }

    // Mapping methods
    private DriverProfileResponse mapToDriverProfile(Driver driver, Wallet wallet) {
        return new DriverProfileResponse(
            driver.getId(),
            driver.getFullName(),
            driver.getMobile(),
            driver.getEmail(),
            driver.getProfileImageUrl(),
            driver.getAccountStatus(),
            driver.getDrivingLicenseNumber(),
            driver.getLicenseExpiryDate(),
            driver.getDrivingLicenseImageUrl() != null,
            driver.getAadhaarNumber(),
            driver.getAadhaarFrontImageUrl() != null,
            driver.getPreferredVehicleType(),
            driver.getTotalTripsCompleted(),
            driver.getTotalEarnings(),
            driver.getRating(),
            driver.getTotalRatings(),
            driver.getIsAvailable(),
            driver.getIsOnTrip(),
            driver.getCurrentLatitude(),
            driver.getCurrentLongitude(),
            driver.getAccountHolderName(),
            driver.getBankName(),
            driver.getIfscCode(),
            driver.getAccountNumber() != null,
            driver.getEmergencyContactName(),
            driver.getEmergencyContactNumber(),
            wallet != null ? wallet.getCurrentBalance().doubleValue() : 0.0,
            wallet != null ? wallet.getWalletNumber() : null,
            driver.getCreatedAt(),
            driver.getLastLoginAt()
        );
    }

    private ShipperProfileResponse mapToShipperProfile(Shipper shipper, Wallet wallet) {
        return new ShipperProfileResponse(
            shipper.getId(),
            shipper.getFullName(),
            shipper.getMobile(),
            shipper.getEmail(),
            shipper.getProfileImageUrl(),
            shipper.getAccountStatus(),
            shipper.getCompanyName(),
            shipper.getGstNumber(),
            shipper.getIsGstVerified(),
            shipper.getBusinessType(),
            shipper.getIndustryType(),
            shipper.getCompanyLogoUrl(),
            shipper.getTotalLoadsPosted(),
            shipper.getActiveLoads(),
            shipper.getTotalSpent(),
            shipper.getAverageRating(),
            shipper.getTotalRatings(),
            shipper.getFreeLoadsRemaining(),
            shipper.getSubscriptionPlan(),
            shipper.getSubscriptionEndDate(),
            shipper.getAddress(),
            shipper.getCity(),
            shipper.getState(),
            shipper.getPincode(),
            wallet != null ? wallet.getCurrentBalance().doubleValue() : 0.0,
            wallet != null ? wallet.getWalletNumber() : null,
            shipper.getCreatedAt(),
            shipper.getLastLoginAt()
        );
    }

    private TransporterProfileResponse mapToTransporterProfile(Transporter transporter, Wallet wallet) {
        return new TransporterProfileResponse(
            transporter.getId(),
            transporter.getFullName(),
            transporter.getMobile(),
            transporter.getEmail(),
            transporter.getProfileImageUrl(),
            transporter.getAccountStatus(),
            transporter.getAgencyName(),
            transporter.getGstNumber(),
            transporter.getPanNumber(),
            transporter.getIsVerified(),
            transporter.getOfficeAddress(),
            transporter.getFleetSize(),
            transporter.getTotalDrivers(),
            transporter.getTotalVehicles(),
            transporter.getDriverIds(),
            transporter.getVehicleIds(),
            transporter.getBidsWon(),
            transporter.getAverageRating(),
            transporter.getTotalRatings(),
            transporter.getAverageDriverRating(),
            transporter.getTotalEarnings(),
            transporter.getServiceAreas(),
            transporter.getExperienceInYears(),
            transporter.getFreeBidsRemaining(),
            transporter.getSubscriptionPlan(),
            transporter.getSubscriptionEndDate(),
            transporter.getCommissionRate(),
            wallet != null ? wallet.getCurrentBalance().doubleValue() : 0.0,
            wallet != null ? wallet.getWalletNumber() : null,
            transporter.getCreatedAt(),
            transporter.getLastLoginAt()
        );
    }

    private VehicleType parseVehicleType(String type) {
        try {
            return type != null ? VehicleType.valueOf(type) : null;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    @Override
    public java.util.Map<String, Object> uploadDocument(Long userId, com.truckmitra.dto.request.user.DocumentUploadRequest request) {
        log.info("Uploading document type: {} for user: {}", request.docType(), userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        String docType = request.docType();
        String docNum = request.docNumber();
        String frontUrl = request.docFrontImageUrl();
        String backUrl = request.docBackImageUrl();
        
        if (user.getRole() == com.truckmitra.entity.common.enums.Role.DRIVER) {
            Driver driver = driverRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Driver", "id", userId));
            if ("AADHAAR_FRONT".equalsIgnoreCase(docType)) {
                driver.setAadhaarFrontImageUrl(frontUrl);
                if (docNum != null) driver.setAadhaarNumber(docNum);
            } else if ("AADHAAR_BACK".equalsIgnoreCase(docType)) {
                driver.setAadhaarBackImageUrl(frontUrl != null ? frontUrl : backUrl);
            } else if ("PAN_CARD".equalsIgnoreCase(docType)) {
                driver.setPanCardImageUrl(frontUrl);
                if (docNum != null) driver.setPanNumber(docNum);
            } else if ("DRIVING_LICENSE_FRONT".equalsIgnoreCase(docType)) {
                driver.setDrivingLicenseImageUrl(frontUrl);
                if (docNum != null) driver.setDrivingLicenseNumber(docNum);
            } else if ("VEHICLE_RC".equalsIgnoreCase(docType)) {
                driver.setVehicleFrontImageUrl(frontUrl);
            } else if ("VEHICLE_INSURANCE".equalsIgnoreCase(docType)) {
                driver.setVehicleInsuranceImageUrl(frontUrl);
            } else if ("PROFILE_PICTURE".equalsIgnoreCase(docType)) {
                driver.setProfileImageUrl(frontUrl);
            }
            driverRepository.save(driver);
            checkAndTransitionProfileStatus(driver);
        } else if (user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
            Shipper shipper = shipperRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Shipper", "id", userId));
            if ("AADHAAR_FRONT".equalsIgnoreCase(docType)) {
                shipper.setAadhaarFrontImageUrl(frontUrl);
                if (docNum != null) shipper.setAadhaarNumber(docNum);
            } else if ("AADHAAR_BACK".equalsIgnoreCase(docType)) {
                shipper.setAadhaarBackImageUrl(frontUrl != null ? frontUrl : backUrl);
            } else if ("PAN_CARD".equalsIgnoreCase(docType)) {
                shipper.setPanCardImageUrl(frontUrl);
                if (docNum != null) shipper.setPanNumber(docNum);
            } else if ("GST_CERTIFICATE".equalsIgnoreCase(docType)) {
                shipper.setGstCertificateUrl(frontUrl);
                if (docNum != null) shipper.setGstNumber(docNum);
            } else if ("BUSINESS_PROOF".equalsIgnoreCase(docType)) {
                shipper.setBusinessProofUrl(frontUrl);
            } else if ("PROFILE_PICTURE".equalsIgnoreCase(docType)) {
                shipper.setProfileImageUrl(frontUrl);
            }
            shipperRepository.save(shipper);
            checkAndTransitionProfileStatus(shipper);
        } else if (user.getRole() == com.truckmitra.entity.common.enums.Role.TRANSPORTER) {
            Transporter transporter = transporterRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Transporter", "id", userId));
            if ("AADHAAR_FRONT".equalsIgnoreCase(docType)) {
                transporter.setAadhaarFrontImageUrl(frontUrl);
                if (docNum != null) transporter.setAadhaarNumber(docNum);
            } else if ("AADHAAR_BACK".equalsIgnoreCase(docType)) {
                transporter.setAadhaarBackImageUrl(frontUrl != null ? frontUrl : backUrl);
            } else if ("PAN_CARD".equalsIgnoreCase(docType)) {
                transporter.setPanCardImageUrl(frontUrl);
                if (docNum != null) transporter.setPanNumber(docNum);
            } else if ("GST_CERTIFICATE".equalsIgnoreCase(docType)) {
                transporter.setGstCertificateUrl(frontUrl);
                if (docNum != null) transporter.setGstNumber(docNum);
            } else if ("BUSINESS_PROOF".equalsIgnoreCase(docType)) {
                transporter.setBusinessCardUrl(frontUrl);
            } else if ("PROFILE_PICTURE".equalsIgnoreCase(docType)) {
                transporter.setProfileImageUrl(frontUrl);
            }
            transporterRepository.save(transporter);
            checkAndTransitionProfileStatus(transporter);
        }
        
        java.util.Map<String, Object> docMap = new java.util.HashMap<>();
        docMap.put("id", System.currentTimeMillis() % 1000000L);
        docMap.put("userId", userId);
        docMap.put("docType", docType);
        docMap.put("docNumber", docNum);
        docMap.put("docFrontImageUrl", frontUrl);
        docMap.put("docBackImageUrl", backUrl);
        docMap.put("verificationStatus", "PENDING");
        docMap.put("uploadedAt", java.time.LocalDateTime.now().toString());
        return docMap;
    }

    @Override
    public java.util.List<java.util.Map<String, Object>> getMyDocuments(Long userId) {
        log.info("Fetching documents for user: {}", userId);
        java.util.List<java.util.Map<String, Object>> documents = new java.util.ArrayList<>();
        
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return documents;
        
        String verificationStatus = user.getAccountStatus() == com.truckmitra.entity.common.enums.AccountStatus.VERIFIED ? "APPROVED" : 
                                     user.getAccountStatus() == com.truckmitra.entity.common.enums.AccountStatus.REJECTED ? "REJECTED" : "PENDING";
        
        if (user.getRole() == com.truckmitra.entity.common.enums.Role.DRIVER) {
            Driver driver = driverRepository.findById(userId).orElse(null);
            if (driver != null) {
                addDocIfNotNull(documents, userId, "AADHAAR_FRONT", driver.getAadhaarNumber(), driver.getAadhaarFrontImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "AADHAAR_BACK", null, driver.getAadhaarBackImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "PAN_CARD", driver.getPanNumber(), driver.getPanCardImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "DRIVING_LICENSE_FRONT", driver.getDrivingLicenseNumber(), driver.getDrivingLicenseImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "VEHICLE_RC", null, driver.getVehicleFrontImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "VEHICLE_INSURANCE", null, driver.getVehicleInsuranceImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "PROFILE_PICTURE", null, driver.getProfileImageUrl(), null, verificationStatus);
            }
        } else if (user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
            Shipper shipper = shipperRepository.findById(userId).orElse(null);
            if (shipper != null) {
                addDocIfNotNull(documents, userId, "AADHAAR_FRONT", shipper.getAadhaarNumber(), shipper.getAadhaarFrontImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "AADHAAR_BACK", null, shipper.getAadhaarBackImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "PAN_CARD", shipper.getPanNumber(), shipper.getPanCardImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "GST_CERTIFICATE", shipper.getGstNumber(), shipper.getGstCertificateUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "BUSINESS_PROOF", null, shipper.getBusinessProofUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "PROFILE_PICTURE", null, shipper.getProfileImageUrl(), null, verificationStatus);
            }
        } else if (user.getRole() == com.truckmitra.entity.common.enums.Role.TRANSPORTER) {
            Transporter transporter = transporterRepository.findById(userId).orElse(null);
            if (transporter != null) {
                addDocIfNotNull(documents, userId, "AADHAAR_FRONT", transporter.getAadhaarNumber(), transporter.getAadhaarFrontImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "AADHAAR_BACK", null, transporter.getAadhaarBackImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "PAN_CARD", transporter.getPanNumber(), transporter.getPanCardImageUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "GST_CERTIFICATE", transporter.getGstNumber(), transporter.getGstCertificateUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "BUSINESS_PROOF", null, transporter.getBusinessCardUrl(), null, verificationStatus);
                addDocIfNotNull(documents, userId, "PROFILE_PICTURE", null, transporter.getProfileImageUrl(), null, verificationStatus);
            }
        }
        
        return documents;
    }

    private void addDocIfNotNull(java.util.List<java.util.Map<String, Object>> list, Long userId, String docType, String docNumber, String frontUrl, String backUrl, String verificationStatus) {
        if (frontUrl != null && !frontUrl.isEmpty()) {
            java.util.Map<String, Object> doc = new java.util.HashMap<>();
            doc.put("id", (long) docType.hashCode());
            doc.put("userId", userId);
            doc.put("docType", docType);
            doc.put("docNumber", docNumber);
            doc.put("docFrontImageUrl", frontUrl);
            doc.put("docBackImageUrl", backUrl);
            doc.put("verificationStatus", verificationStatus);
            doc.put("uploadedAt", java.time.LocalDateTime.now().toString());
            list.add(doc);
        }
    }

    @Override
    public boolean isProfileCompleted(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        
        if (user.getRole() == com.truckmitra.entity.common.enums.Role.DRIVER) {
            Driver driver = driverRepository.findById(userId).orElse(null);
            if (driver == null) return false;
            return driver.getDrivingLicenseNumber() != null && driver.getDrivingLicenseImageUrl() != null
                    && driver.getAadhaarNumber() != null && driver.getAadhaarFrontImageUrl() != null;
        } else if (user.getRole() == com.truckmitra.entity.common.enums.Role.SHIPPER) {
            Shipper shipper = shipperRepository.findById(userId).orElse(null);
            if (shipper == null) return false;
            return shipper.getCompanyName() != null && shipper.getGstNumber() != null
                    && shipper.getGstCertificateUrl() != null && shipper.getPanNumber() != null;
        } else if (user.getRole() == com.truckmitra.entity.common.enums.Role.TRANSPORTER) {
            Transporter transporter = transporterRepository.findById(userId).orElse(null);
            if (transporter == null) return false;
            return transporter.getAgencyName() != null && transporter.getGstNumber() != null
                    && transporter.getGstCertificateUrl() != null && transporter.getPanNumber() != null;
        }
        return false;
    }

    private void checkAndTransitionProfileStatus(User user) {
        boolean completed = isProfileCompleted(user.getId());
        user.setIsProfileCompleted(completed);
        if (completed && (user.getAccountStatus() == com.truckmitra.entity.common.enums.AccountStatus.REGISTERED 
                || user.getAccountStatus() == com.truckmitra.entity.common.enums.AccountStatus.REJECTED)) {
            user.setAccountStatus(com.truckmitra.entity.common.enums.AccountStatus.PENDING_VERIFICATION);
        }
        userRepository.save(user);
    }
}