// src/main/java/com/truckmitra/service/impl/auth/AuthServiceImpl.java
package com.truckmitra.service.impl.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.truckmitra.common.utils.OtpGenerator;
import com.truckmitra.dto.request.auth.*;
import com.truckmitra.dto.response.auth.AuthResponse;
import com.truckmitra.dto.response.auth.OtpResponse;
import com.truckmitra.entity.user.*;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.common.enums.VehicleType;
import com.truckmitra.entity.wallet.Wallet;
import com.truckmitra.enums.NotificationTemplate;
import com.truckmitra.exception.BadRequestException;
import com.truckmitra.exception.ResourceNotFoundException;
import com.truckmitra.exception.UnauthorizedException;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.repository.user.DriverRepository;
import com.truckmitra.repository.user.ShipperRepository;
import com.truckmitra.repository.user.TransporterRepository;
import com.truckmitra.repository.wallet.WalletRepository;
import com.truckmitra.security.jwt.JwtService;
import com.truckmitra.security.oauth2.FacebookTokenValidator;
import com.truckmitra.security.oauth2.GoogleTokenValidator;
import com.truckmitra.service.auth.AuthService;
import com.truckmitra.service.notification.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final ShipperRepository shipperRepository;
    private final TransporterRepository transporterRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final OtpGenerator otpGenerator;
    private final NotificationService notificationService;
    private final HttpServletRequest httpServletRequest;
    private final GoogleTokenValidator googleTokenValidator;
    private final FacebookTokenValidator facebookTokenValidator;
    private final com.truckmitra.service.security.RefreshTokenService refreshTokenService;
    private final com.truckmitra.repository.user.DeviceTokenRepository deviceTokenRepository;

    // ==================== OTP Methods ====================

    @Override
    public OtpResponse sendOtp(String mobile) {
        log.info("Sending OTP to mobile: {}", mobile);

        // Generate OTP
        String otp = otpGenerator.generateOtp(mobile);
        
        // Check if user exists
        boolean isNewUser = !userRepository.existsByMobile(mobile);

        // Send OTP via SMS
        notificationService.sendOtpSms(mobile, otp);

        log.info("OTP sent successfully to: {}", mobile);

        return new OtpResponse(
            "OTP sent successfully",
            mobile,
            isNewUser,
            otpGenerator.getExpirySeconds()
        );
    }

    @Override
    public String generateOtp(String mobile) {
        log.info("Generating OTP for mobile: {}", mobile);

        String otp = otpGenerator.generateOtp(mobile);
        
        // Send OTP via SMS
        notificationService.sendOtpSms(mobile, otp);

        // Update user's OTP info if exists
        findUserByMobile(mobile).ifPresent(user -> {
            user.setLastOtpSentAt(LocalDateTime.now());
            saveUserByRole(user);
        });

        return otp;
    }

    @Override
    public boolean verifyOtp(String mobile, String otp) {
        return otpGenerator.validateOtp(mobile, otp);
    }

    // ==================== Registration ====================

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with mobile: {}", request.mobile());

        // Check if user already exists
        if (userRepository.existsByMobile(request.mobile())) {
            throw new BadRequestException("User already exists with this mobile number");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("User already exists with this email");
        }

        // Create and save user based on role - using specific repositories
        User savedUser = createAndSaveUserByRole(request);
        
        log.info("User registered successfully: {} with role: {}", savedUser.getId(), savedUser.getRole());

        // Create wallet for user
        createWallet(savedUser);

        // Send welcome notification
        notificationService.sendNotification(
            savedUser.getId(),
            NotificationTemplate.WELCOME_EMAIL,
            Map.of(
                "name", savedUser.getFullName(),
                "role", savedUser.getRole().getDisplayName(),
                "registrationDate", LocalDateTime.now().toString()
            ),
            "Welcome to TruckMitra!"
        );

        // Generate token and return response
        return generateAuthResponse(savedUser);
    }

    // ==================== Login Methods ====================

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login with type: {}", request.loginType());

        return switch (request.getLoginTypeEnum()) {
            case EMAIL_PASSWORD -> loginWithEmailPassword(request);
            case PHONE_OTP -> loginWithOtp(request.mobile(), request.otp(), request.deviceToken());
            case GOOGLE -> loginWithGoogle(request.googleToken(), request.deviceToken());
            case FACEBOOK -> loginWithFacebook(request.facebookToken(), request.deviceToken());
        };
    }

   private AuthResponse loginWithEmailPassword(LoginRequest request) {
    // Determine which credential to authenticate with
    String loginIdentifier = request.email() != null ? request.email().toLowerCase().trim() : null;
    
    // If mobile is provided but no email (user typed mobile in the form),
    // look up the user's email from their mobile number
    if ((loginIdentifier == null || loginIdentifier.isBlank()) && request.mobile() != null) {
        User userByMobile = userRepository.findByMobile(request.mobile())
                .orElseThrow(() -> new ResourceNotFoundException("User", "mobile", request.mobile()));
        loginIdentifier = userByMobile.getEmail();
        if (loginIdentifier == null || loginIdentifier.isBlank()) {
            // No email set - authenticate directly by mobile
            loginIdentifier = request.mobile();
        }
    }

    if (loginIdentifier == null || loginIdentifier.isBlank() || request.password() == null) {
        throw new BadRequestException("Invalid email/password login request");
    }

    try {
        log.error("DEBUG LOGIN - Identifier: '{}', Password: '{}'", loginIdentifier, request.password());
        // Authenticate using Spring Security
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginIdentifier, request.password())
        );
    } catch (BadCredentialsException e) {
        throw new BadCredentialsException("Invalid credentials. Please check your email/mobile and password.");
    }

    final String finalIdentifier = loginIdentifier;
    // Get user by email or mobile
    User user = userRepository.findByEmail(finalIdentifier)
            .or(() -> userRepository.findByMobile(finalIdentifier))
            .orElseThrow(() -> new ResourceNotFoundException("User", "identifier", finalIdentifier));

    validateUserForLogin(user);
    
    // Update device token
    if (request.deviceToken() != null) {
        user.setDeviceToken(request.deviceToken());
    }

    user.updateLastLogin(httpServletRequest.getRemoteAddr());
    
    // Save using appropriate repository
    saveUserByRole(user);

    log.info("User logged in successfully: {} with email/mobile", user.getId());

    return generateAuthResponse(user);
}

    @Override
    public AuthResponse loginWithOtp(String mobile, String otp, String deviceToken) {
        log.info("Processing OTP login for mobile: {}", mobile);

        // Validate OTP
        if (!otpGenerator.validateOtp(mobile, otp)) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        // Get or create user
        User user = userRepository.findByMobile(mobile).orElse(null);
        
        if (user == null) {
            // New user - create basic account
            user = createAndSaveOtpUser(mobile);
        }

        // Update device token
        if (deviceToken != null) {
            user.setDeviceToken(deviceToken);
        }

        user.setIsMobileVerified(true);
        user.updateLastLogin(httpServletRequest.getRemoteAddr());
        
        // Save using appropriate repository
        saveUserByRole(user);

        log.info("User logged in successfully: {} with OTP", user.getId());

        return generateAuthResponse(user);
    }

    @Override
    public AuthResponse loginWithGoogle(String googleToken, String deviceToken) {
        log.info("Processing Google login");

        // Validate Google token
        GoogleIdToken.Payload payload = googleTokenValidator.validateToken(googleToken);
        
        String email = payload.getEmail();
        String googleId = payload.getSubject();

        // Check if user exists
        User user = userRepository.findByGoogleId(googleId).orElse(null);
        
        if (user == null && email != null) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        if (user == null) {
            // New user - create account
            user = createAndSaveGoogleUser(payload);
        } else {
            // Existing user - update Google ID if not set
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                user.setIsGoogleLogin(true);
                saveUserByRole(user);
            }
        }

        // Update device token
        if (deviceToken != null) {
            user.setDeviceToken(deviceToken);
        }

        user.updateLastLogin(httpServletRequest.getRemoteAddr());
        saveUserByRole(user);

        log.info("User logged in successfully: {} with Google", user.getId());

        return generateAuthResponse(user);
    }

    @Override
    public AuthResponse loginWithFacebook(String facebookToken, String deviceToken) {
        log.info("Processing Facebook login");

        // Validate Facebook token
        Map<String, Object> userInfo = facebookTokenValidator.validateToken(facebookToken);
        
        String facebookId = (String) userInfo.get("id");
        String email = (String) userInfo.get("email");

        // Check if user exists
        User user = userRepository.findByFacebookId(facebookId).orElse(null);
        
        if (user == null && email != null) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        if (user == null) {
            // New user - create account
            user = createAndSaveFacebookUser(userInfo);
        } else {
            // Existing user - update Facebook ID if not set
            if (user.getFacebookId() == null) {
                user.setFacebookId(facebookId);
                user.setIsFacebookLogin(true);
                saveUserByRole(user);
            }
        }

        // Update device token
        if (deviceToken != null) {
            user.setDeviceToken(deviceToken);
        }

        user.updateLastLogin(httpServletRequest.getRemoteAddr());
        saveUserByRole(user);

        log.info("User logged in successfully: {} with Facebook", user.getId());

        return generateAuthResponse(user);
    }

    // ==================== Token Management ====================

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        return refreshTokenService.findByToken(refreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(com.truckmitra.entity.user.RefreshToken::getUser)
                .map(user -> {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getMobile());
                    String token = jwtService.generateToken(userDetails, user.getId(), user.getRole().name());
                    log.info("Token refreshed for user: {}", user.getId());
                    return generateAuthResponse(user, token, refreshToken);
                })
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));
    }

    @Override
    public void logout(Long userId) {
        log.info("Logging out user: {}", userId);
        refreshTokenService.deleteByUserId(userId);
        deviceTokenRepository.deactivateAllTokensForUser(userId);
    }

    @Override
    public boolean validateToken(String token) {
        try {
            String mobile = jwtService.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(mobile);
            return jwtService.isTokenValid(token, userDetails);
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    // ==================== Password Management ====================

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        log.info("Password reset requested for email: {}", request.email());

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.email()));

        // Generate and send OTP using email as identifier key
        String otp = otpGenerator.generateOtp(request.email());
        
        notificationService.sendNotification(
            user.getId(),
            String.format("Your TruckMitra password reset OTP is: %s. Valid for 5 minutes.", otp)
        );
    }

    @Override
    @Transactional
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        log.info("Resetting password for email: {}", request.email());

        // Validate OTP using email as identifier key
        if (!otpGenerator.validateOtp(request.email(), request.otp())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.email()));

        // Update password
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.resetFailedAttempts();
        saveUserByRole(user);

        log.info("Password reset successful for user: {}", user.getId());

        return generateAuthResponse(user);
    }

    // ==================== User Creation with Specific Repositories ====================

    private User createAndSaveUserByRole(RegisterRequest request) {
        // Set common fields
        User user;
        
        switch (request.role()) {
            case DRIVER:
                Driver driver = Driver.builder()
                    .drivingLicenseNumber(request.drivingLicenseNumber())
                    .licenseExpiryDate(request.licenseExpiryDate() != null && !request.licenseExpiryDate().isBlank() ? java.time.LocalDate.parse(request.licenseExpiryDate()) : null)
                    .aadhaarNumber(request.aadhaarNumber())
                    .aadhaarFrontImageUrl(request.aadhaarFrontImageUrl())
                    .aadhaarBackImageUrl(request.aadhaarBackImageUrl())
                    .panNumber(request.panNumber())
                    .panCardImageUrl(request.panCardImageUrl())
                    .vehicleNumber(request.vehicleNumber())
                    .vehicleCapacity(request.vehicleCapacity())
                    .vehiclePucImageUrl(request.vehiclePucImageUrl())
                    .vehicleFrontImageUrl(request.vehicleFrontImageUrl())
                    .vehicleBackImageUrl(request.vehicleBackImageUrl())
                    .vehicleInsuranceImageUrl(request.vehicleInsuranceImageUrl())
                    .vehicleFuelType(request.vehicleFuelType())
                    .emergencyContactName(request.emergencyContactName())
                    .emergencyContactNumber(request.emergencyContactNumber())
                    .preferredVehicleType(request.preferredVehicleType() != null ? parseVehicleType(request.preferredVehicleType()) : null)
                    .build();
                
                // Set common fields
                setCommonUserFields(driver, request);
                
                // Save using DriverRepository
                driver = driverRepository.save(driver);
                user = driver;
                log.info("Driver saved with ID: {}", user.getId());
                break;
                
            case SHIPPER:
                Shipper shipper = Shipper.builder()
                    .companyName(request.companyName())
                    .gstNumber(request.gstNumber())
                    .aadhaarNumber(request.aadhaarNumber())
                    .aadhaarFrontImageUrl(request.aadhaarFrontImageUrl())
                    .aadhaarBackImageUrl(request.aadhaarBackImageUrl())
                    .panNumber(request.panNumber())
                    .panCardImageUrl(request.panCardImageUrl())
                    .businessType(request.businessType())
                    .industryType(request.industryType())
                    .build();
                
                // Set common fields
                setCommonUserFields(shipper, request);
                
                // Save using ShipperRepository
                shipper = shipperRepository.save(shipper);
                user = shipper;
                log.info("Shipper saved with ID: {}", user.getId());
                break;
                
            case TRANSPORTER:
                Transporter transporter = Transporter.builder()
                    .agencyName(request.agencyName())
                    .gstNumber(request.gstNumber())
                    .aadhaarNumber(request.aadhaarNumber())
                    .aadhaarFrontImageUrl(request.aadhaarFrontImageUrl())
                    .aadhaarBackImageUrl(request.aadhaarBackImageUrl())
                    .panNumber(request.panNumber())
                    .panCardImageUrl(request.panCardImageUrl())
                    .fleetSize(request.fleetSize())
                    .serviceAreas(request.serviceAreas())
                    .experienceInYears(request.experienceInYears())
                    .build();
                
                // Set common fields
                setCommonUserFields(transporter, request);
                
                // Save using TransporterRepository
                transporter = transporterRepository.save(transporter);
                user = transporter;
                log.info("Transporter saved with ID: {}", user.getId());
                break;
                
            default:
                throw new BadRequestException("Invalid role: " + request.role());
        }

        return user;
    }
// ==================== Regular Registration ====================
private void setCommonUserFields(User user, RegisterRequest request) {
    user.setFullName(request.fullName());
    user.setMobile(request.mobile());
    user.setEmail(request.email() != null ? request.email().toLowerCase().trim() : null);
    user.setPassword(passwordEncoder.encode(request.password()));
    user.setRole(request.role());
    // OPTION 1: Auto-approve for testing
    user.setAccountStatus(AccountStatus.REGISTERED);
    
    // OPTION 2: Pending for production (uncomment below and comment above)
    // user.setAccountStatus(AccountStatus.PENDING);
    
    user.setAddress(request.address());
    user.setLandmark(request.landmark());
    user.setArea(request.area());
    user.setCity(request.city());
    user.setState(request.state());
    user.setPincode(request.pincode());
    user.setIsMobileVerified(true);
    user.setRegisteredIp(httpServletRequest.getRemoteAddr());
    user.setRegisteredAt(LocalDateTime.now());
    user.setPreferredLoginType(request.preferredLoginType());
}



// ==================== Google Login ====================
private User createAndSaveGoogleUser(GoogleIdToken.Payload payload) {
    Shipper shipper = Shipper.builder()
        .fullName((String) payload.get("name"))
        .email(payload.getEmail())
        .googleId(payload.getSubject())
        .isGoogleLogin(true)
        .isMobileVerified(false)
        .isEmailVerified(Boolean.TRUE.equals(payload.getEmailVerified()))
        .role(Role.SHIPPER)
        .accountStatus(AccountStatus.REGISTERED)
        .preferredLoginType("GOOGLE")
        .profileImageUrl((String) payload.get("picture"))
        .registeredIp(httpServletRequest.getRemoteAddr())
        .registeredAt(LocalDateTime.now())
        .build();

    shipper = shipperRepository.save(shipper);
    log.info("Google user created as Shipper with ID: {}", shipper.getId());
    return shipper;
}



// ==================== Facebook Login ====================
private User createAndSaveFacebookUser(Map<String, Object> userInfo) {
    String profileImageUrl = null;
    Map<String, Object> picture = (Map<String, Object>) userInfo.get("picture");
    if (picture != null) {
        Map<String, Object> data = (Map<String, Object>) picture.get("data");
        if (data != null) {
            profileImageUrl = (String) data.get("url");
        }
    }

    Shipper shipper = Shipper.builder()
        .fullName((String) userInfo.get("name"))
        .email((String) userInfo.get("email"))
        .facebookId((String) userInfo.get("id"))
        .isFacebookLogin(true)
        .isMobileVerified(false)
        .isEmailVerified(true)
        .role(Role.SHIPPER)
        .accountStatus(AccountStatus.REGISTERED)
        .preferredLoginType("FACEBOOK")
        .profileImageUrl(profileImageUrl)
        .registeredIp(httpServletRequest.getRemoteAddr())
        .registeredAt(LocalDateTime.now())
        .build();

    shipper = shipperRepository.save(shipper);
    log.info("Facebook user created as Shipper with ID: {}", shipper.getId());
    return shipper;
}

// ==================== OTP Login ====================
private User createAndSaveOtpUser(String mobile) {
    Driver driver = Driver.builder()
        .mobile(mobile)
        .fullName("User-" + mobile.substring(mobile.length() - 4))
        .isMobileVerified(true)
        .isEmailVerified(false)
        .role(Role.DRIVER)
        .accountStatus(AccountStatus.REGISTERED)
        .preferredLoginType("PHONE_OTP")
        .registeredIp(httpServletRequest.getRemoteAddr())
        .registeredAt(LocalDateTime.now())
        .build();

    driver = driverRepository.save(driver);
    log.info("OTP user created as Driver with ID: {}", driver.getId());
    return driver;
}


    // ==================== Helper Methods ====================

    private void saveUserByRole(User user) {
        if (user instanceof Driver) {
            driverRepository.save((Driver) user);
            log.debug("Driver saved with ID: {}", user.getId());
        } else if (user instanceof Shipper) {
            shipperRepository.save((Shipper) user);
            log.debug("Shipper saved with ID: {}", user.getId());
        } else if (user instanceof Transporter) {
            transporterRepository.save((Transporter) user);
            log.debug("Transporter saved with ID: {}", user.getId());
        } else {
            userRepository.save(user);
            log.debug("User saved with ID: {}", user.getId());
        }
    }

    private java.util.Optional<User> findUserByMobile(String mobile) {
        return userRepository.findByMobile(mobile);
    }

    // ==================== Wallet Helpers ====================

    private void createWallet(User user) {
        String walletNumber = generateWalletNumber(user.getId(), user.getRole());
        
        Wallet wallet = Wallet.builder()
                .userId(user.getId())
                .userRole(user.getRole().name())
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
        log.info("Wallet created for user: {} with number: {}", user.getId(), walletNumber);
    }

    private String generateWalletNumber(Long userId, Role role) {
        String roleCode = switch (role) {
            case DRIVER -> "DR";
            case SHIPPER -> "SH";
            case TRANSPORTER -> "TR";
            case ADMIN -> "AD";
        };
        
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(7);
        String random = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        
        return String.format("WAL%s%d%s%s", roleCode, userId, timestamp, random);
    }

    // src/main/java/com/truckmitra/service/impl/auth/AuthServiceImpl.java

private AuthResponse generateAuthResponse(User user) {
    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getMobile());
    String token = jwtService.generateToken(userDetails, user.getId(), user.getRole().name());
    com.truckmitra.entity.user.RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
    return generateAuthResponse(user, token, refreshToken.getToken());
}

private AuthResponse generateAuthResponse(User user, String accessToken, String refreshToken) {
    // Get wallet info
    AuthResponse.WalletInfo walletInfo = getWalletInfo(user.getId(), user.getRole().name());
    
    // Check if profile is complete
    boolean isProfileComplete = isProfileComplete(user);
    
    // Build response using builder
    return AuthResponse.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .mobile(user.getMobile())
            .email(user.getEmail())
            .role(user.getRole())
            .accountStatus(user.getAccountStatus())
            .token(accessToken)
            .refreshToken(refreshToken)
            .profileImageUrl(user.getProfileImageUrl())
            .isProfileComplete(isProfileComplete)
            .wallet(walletInfo)
            .build();
}

/**
 * Get wallet information for user
 */
private AuthResponse.WalletInfo getWalletInfo(Long userId, String role) {
    return walletRepository.findByUserIdAndUserRole(userId, role)
            .map(wallet -> new AuthResponse.WalletInfo(
                wallet.getWalletNumber(),
                wallet.getCurrentBalance() != null ? wallet.getCurrentBalance().doubleValue() : 0.0,
                "ACTIVE".equals(wallet.getWalletStatus())
            ))
            .orElse(null);
}

/**
 * Check if user profile is complete based on role
 */
private boolean isProfileComplete(User user) {
    // Base checks for all users
    if (user.getFullName() == null || user.getEmail() == null || 
        user.getMobile() == null || user.getAddress() == null) {
        return false;
    }
    
    // Role-specific checks
    if (user instanceof Driver driver) {
        return driver.getDrivingLicenseNumber() != null &&
               driver.getLicenseExpiryDate() != null &&
               driver.getEmergencyContactName() != null &&
               driver.getEmergencyContactNumber() != null;
    }
    
    if (user instanceof Shipper shipper) {
        return shipper.getCompanyName() != null &&
               shipper.getGstNumber() != null &&
               shipper.getBusinessType() != null;
    }
    
    if (user instanceof Transporter transporter) {
        return transporter.getAgencyName() != null &&
               transporter.getFleetSize() != null &&
               transporter.getServiceAreas() != null;
    }
    
    // Admin and others are considered complete
    return true;
}

    // ==================== Validation Helpers ====================

// src/main/java/com/truckmitra/service/impl/auth/AuthServiceImpl.java

private void validateUserForLogin(User user) {
    log.info("Validating login for user: {} with role: {} and status: {}", 
             user.getId(), user.getRole(), user.getAccountStatus());
    
    // ✅ SUPER ADMIN - Full access always
    if (user.getRole() == Role.ADMIN) {
        log.info("Admin login allowed: {}", user.getId());
        return; // Admin can always login regardless of status
    }
    
    // ✅ Check for deleted accounts first
    if (user.getAccountStatus() == AccountStatus.DELETED) {
        log.warn("Deleted user attempted login: {}", user.getId());
        throw new UnauthorizedException(
            "❌ Your account has been deleted. If you think this is a mistake, please contact support at support@truckmitra.com."
        );
    }
    
    // ✅ Check for locked accounts due to failed attempts
    if (user.isLocked()) {
        log.warn("Locked user attempted login: {}", user.getId());
        throw new UnauthorizedException(
            "🔒 Account is locked due to multiple failed attempts. Please try again after 30 minutes."
        );
    }
    
    // ✅ ALLOW LOGIN FOR ALL OTHER STATUSES - But with appropriate messages
    
    // For REGISTERED users (just registered, no profile)
    if (user.getAccountStatus() == AccountStatus.REGISTERED) {
        log.info("REGISTERED user logged in: {}", user.getId());
        // Allow login, frontend will show profile completion prompt
        return;
    }
    
    // For PENDING_VERIFICATION users (profile complete, waiting for admin)
    if (user.getAccountStatus() == AccountStatus.PENDING_VERIFICATION) {
        log.info("PENDING_VERIFICATION user logged in: {}", user.getId());
        // Allow login, frontend will show waiting for approval message
        return;
    }
    
    // For REJECTED users
    if (user.getAccountStatus() == AccountStatus.REJECTED) {
        log.warn("REJECTED user attempted login: {}", user.getId());
        throw new UnauthorizedException(
            "❌ Your account verification has been rejected. Please contact support at support@truckmitra.com for assistance."
        );
    }
    
    // For SUSPENDED users
    if (user.getAccountStatus() == AccountStatus.SUSPENDED) {
        log.warn("SUSPENDED user attempted login: {}", user.getId());
        throw new UnauthorizedException(
            "⚠️ Your account has been suspended. Please contact support at support@truckmitra.com for assistance."
        );
    }
    
    // For VERIFIED users - full access
    if (user.getAccountStatus() == AccountStatus.VERIFIED) {
        log.info("VERIFIED user logged in: {}", user.getId());
        return;
    }
    
    // Fallback for any unknown status
    log.warn("User with unknown status {} attempted login", user.getAccountStatus());
    throw new UnauthorizedException(
        "Account status: " + user.getAccountStatus().getDisplayName() + 
        ". Please contact support for assistance."
    );
}

    private VehicleType parseVehicleType(String type) {
        try {
            return type != null ? VehicleType.valueOf(type.toUpperCase()) : null;
        } catch (IllegalArgumentException e) {
            log.warn("Invalid vehicle type: {}", type);
            return null;
        }
    }
}