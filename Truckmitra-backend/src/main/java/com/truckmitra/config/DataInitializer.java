// src/main/java/com/truckmitra/config/DataInitializer.java
package com.truckmitra.config;

import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.user.User;
import com.truckmitra.entity.user.Driver;
import com.truckmitra.entity.user.Shipper;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminUser();
        createTestUsers(); // Optional: for testing
    }

    /**
     * Create admin user with full control
     * Admin can:
     * - Approve/Reject users
     * - Suspend/Activate users
     * - Delete/Restore users
     * - View all statistics
     * - Manage all platform settings
     */
    private void createAdminUser() {
        if (!userRepository.existsByEmail("admin@truckmitra.com")) {
            User admin = new User();
            
            // Basic Info
            admin.setFullName("Super Admin");
            admin.setMobile("9999999999");
            admin.setEmail("admin@truckmitra.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            
            // Role & Status
            admin.setRole(Role.ADMIN);
            admin.setAccountStatus(AccountStatus.VERIFIED);  // ✅ Admin is always VERIFIED
            admin.setIsVerified(true);
            admin.setIsProfileCompleted(true);
            
            // Verification
            admin.setVerifiedBy(0L);  // System created
            admin.setVerifiedAt(LocalDateTime.now());
            
            // Preferences
            admin.setIsMobileVerified(true);
            admin.setPreferredLoginType("EMAIL_PASSWORD");
            admin.setRegisteredAt(LocalDateTime.now());
            
            // Active status
            admin.setIsActive(true);
            
            userRepository.save(admin);
            log.info("✅ Admin user created successfully with VERIFIED status!");
            log.info("📧 Email: admin@truckmitra.com");
            log.info("🔑 Password: Admin@123");
        } else {
            log.info("✅ Admin user already exists");
            
            // Optional: Update existing admin to ensure correct status
            userRepository.findByEmail("admin@truckmitra.com").ifPresent(admin -> {
                if (admin.getAccountStatus() != AccountStatus.VERIFIED) {
                    admin.setAccountStatus(AccountStatus.VERIFIED);
                    admin.setIsVerified(true);
                    userRepository.save(admin);
                    log.info("✅ Updated existing admin to VERIFIED status");
                }
            });
        }
    }

    /**
     * Create test users for development (Optional)
     */
    private void createTestUsers() {
        // Create a test driver with REGISTERED status
        if (!userRepository.existsByMobile("8888888888")) {
            Driver testDriver = new Driver();
            testDriver.setFullName("Test Driver");
            testDriver.setMobile("8888888888");
            testDriver.setEmail("driver@test.com");
            testDriver.setPassword(passwordEncoder.encode("Driver@123"));
            testDriver.setRole(Role.DRIVER);
            testDriver.setAccountStatus(AccountStatus.REGISTERED);
            testDriver.setIsVerified(false);
            testDriver.setIsProfileCompleted(false);
            testDriver.setIsMobileVerified(true);
            testDriver.setRegisteredAt(LocalDateTime.now());
            testDriver.setIsActive(true);
            
            userRepository.save(testDriver);
            log.info("✅ Test driver created with REGISTERED status");
        }

        // Create a test shipper with PENDING_VERIFICATION status
        if (!userRepository.existsByMobile("7777777777")) {
            Shipper testShipper = new Shipper();
            testShipper.setCompanyName("Test Shipper Co");
            testShipper.setFullName("Test Shipper");
            testShipper.setMobile("7777777777");
            testShipper.setEmail("shipper@test.com");
            testShipper.setPassword(passwordEncoder.encode("Shipper@123"));
            testShipper.setRole(Role.SHIPPER);
            testShipper.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
            testShipper.setIsVerified(false);
            testShipper.setIsProfileCompleted(true);
            testShipper.setIsMobileVerified(true);
            testShipper.setRegisteredAt(LocalDateTime.now());
            testShipper.setIsActive(true);
            
            userRepository.save(testShipper);
            log.info("✅ Test shipper created with PENDING_VERIFICATION status");
        }

        // Create a test transporter with VERIFIED status
        if (!userRepository.existsByMobile("6666666666")) {
            Transporter testTransporter = new Transporter();
            testTransporter.setAgencyName("Test Agency");
            testTransporter.setFleetSize(10);
            testTransporter.setFullName("Test Transporter");
            testTransporter.setMobile("6666666666");
            testTransporter.setEmail("transporter@test.com");
            testTransporter.setPassword(passwordEncoder.encode("Transporter@123"));
            testTransporter.setRole(Role.TRANSPORTER);
            testTransporter.setAccountStatus(AccountStatus.VERIFIED);
            testTransporter.setIsVerified(true);
            testTransporter.setIsProfileCompleted(true);
            testTransporter.setIsMobileVerified(true);
            testTransporter.setRegisteredAt(LocalDateTime.now());
            testTransporter.setIsActive(true);
            
            userRepository.save(testTransporter);
            log.info("✅ Test transporter created with VERIFIED status");
        }
    }
}