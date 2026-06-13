// src/main/java/com/truckmitra/service/admin/impl/AdminUserServiceImpl.java
package com.truckmitra.service.admin.impl;

import com.truckmitra.dto.admin.request.*;
import com.truckmitra.dto.admin.response.BulkOperationResponse;
import com.truckmitra.dto.admin.response.UserDetailResponse;
import com.truckmitra.dto.admin.response.UserStatsResponse;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.user.User;
import com.truckmitra.exception.BadRequestException;
import com.truckmitra.exception.ResourceNotFoundException;
import com.truckmitra.exception.UnauthorizedException;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.service.admin.AdminUserService;
import com.truckmitra.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;

    // ==================== GET OPERATIONS ====================

    @Override
    public Page<User> getPendingUsers(Pageable pageable) {
        log.debug("Fetching pending users, page: {}, size: {}", 
                  pageable.getPageNumber(), pageable.getPageSize());
        return userRepository.findByAccountStatus(AccountStatus.PENDING_VERIFICATION, pageable);
    }

    @Override
    public UserStatsResponse getUserStats() {
        log.debug("Fetching user statistics");
        
        Map<AccountStatus, Long> counts = new HashMap<>();
        for (AccountStatus status : AccountStatus.values()) {
            counts.put(status, userRepository.countByAccountStatus(status));
        }
        
        return UserStatsResponse.builder()
                .pending(counts.getOrDefault(AccountStatus.PENDING_VERIFICATION, 0L))
                .approved(counts.getOrDefault(AccountStatus.VERIFIED, 0L))
                .rejected(counts.getOrDefault(AccountStatus.REJECTED, 0L))
                .suspended(counts.getOrDefault(AccountStatus.SUSPENDED, 0L))
                .deleted(counts.getOrDefault(AccountStatus.DELETED, 0L))
                .total(userRepository.count())
                .build();
    }

    @Override
    public Page<User> getUsersByStatus(AccountStatus status, Pageable pageable) {
        log.debug("Fetching users with status: {}, page: {}, size: {}", 
                  status, pageable.getPageNumber(), pageable.getPageSize());
        return userRepository.findByAccountStatus(status, pageable);
    }

    @Override
    public UserDetailResponse getUserDetails(Long userId) {
        log.debug("Fetching details for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return UserDetailResponse.fromUser(user);
    }

    @Override
    public Page<User> getAllUsers(AccountStatus status, Role role, String search, Pageable pageable) {
        log.debug("Fetching all users with filters - status: {}, role: {}, search: {}", 
                  status, role, search);
        
        if (search != null && !search.isEmpty()) {
            return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContaining(
                    search, search, search, pageable);
        }
        
        if (status != null && role != null) {
            return userRepository.findByAccountStatusAndRole(status, role, pageable);
        }
        
        if (status != null) {
            return userRepository.findByAccountStatus(status, pageable);
        }
        
        if (role != null) {
            return userRepository.findByRole(role, pageable);
        }
        
        return userRepository.findAll(pageable);
    }

    // ==================== STATUS UPDATE OPERATIONS ====================

    @Override
    public User approveUser(Long userId) {
        log.info("Approving user: {}", userId);
        
        User user = getUserById(userId);
        AccountStatus oldStatus = user.getAccountStatus();
        
        // Validate transition
        if (!isValidTransition(oldStatus, AccountStatus.VERIFIED)) {
            throw new BadRequestException(
                String.format("Cannot approve user from %s status", oldStatus)
            );
        }
        
        // Update user
        user.setAccountStatus(AccountStatus.VERIFIED);
        user.setVerifiedBy(getCurrentAdminId());
        user.setVerifiedAt(LocalDateTime.now());
        user.setIsVerified(true);
        
        User updatedUser = userRepository.save(user);
        
        // Send notification
        String message = getStatusChangeMessage(oldStatus, AccountStatus.VERIFIED, null);
        notificationService.sendNotification(userId, message);
        
        // forward notification to socket relay
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("event", "approveUser");
            payload.put("userId", userId);
            notificationService.forwardNotifyToSocket(payload);
        } catch (Exception e) {
            // non-blocking
        }
        
        log.info("User {} approved successfully", userId);
        
        return updatedUser;
    }

    @Override
    public User rejectUser(Long userId, RejectRequest request) {
        log.info("Rejecting user: {} with reason: {}", userId, request.reason());
        
        User user = getUserById(userId);
        AccountStatus oldStatus = user.getAccountStatus();
        
        // Validate transition
        if (!isValidTransition(oldStatus, AccountStatus.REJECTED)) {
            throw new BadRequestException(
                String.format("Cannot reject user from %s status", oldStatus)
            );
        }
        
        // Update user
        user.setAccountStatus(AccountStatus.REJECTED);
        user.setVerifiedBy(getCurrentAdminId());
        user.setVerifiedAt(LocalDateTime.now());
        user.setIsVerified(false);
        
        User updatedUser = userRepository.save(user);
        
        // Send notification
        String message = getStatusChangeMessage(oldStatus, AccountStatus.REJECTED, request.reason());
        notificationService.sendNotification(userId, message);
        
        log.info("User {} rejected successfully", userId);
        
        return updatedUser;
    }

    @Override
    public User suspendUser(Long userId, SuspendRequest request) {
        log.info("Suspending user: {} with reason: {}", userId, request.reason());
        
        User user = getUserById(userId);
        AccountStatus oldStatus = user.getAccountStatus();
        
        // Validate transition
        if (!isValidTransition(oldStatus, AccountStatus.SUSPENDED)) {
            throw new BadRequestException(
                String.format("Cannot suspend user from %s status", oldStatus)
            );
        }
        
        // Update user
        user.setAccountStatus(AccountStatus.SUSPENDED);
        user.setIsActive(false);
        
        User updatedUser = userRepository.save(user);
        
        // Send notification
        String message = getStatusChangeMessage(oldStatus, AccountStatus.SUSPENDED, request.reason());
        notificationService.sendNotification(userId, message);
        
        log.info("User {} suspended successfully", userId);
        
        return updatedUser;
    }

    @Override
    public User activateUser(Long userId) {
        log.info("Activating user: {}", userId);
        
        User user = getUserById(userId);
        AccountStatus oldStatus = user.getAccountStatus();
        
        // Validate transition
        if (!isValidTransition(oldStatus, AccountStatus.VERIFIED)) {
            throw new BadRequestException(
                String.format("Cannot activate user from %s status", oldStatus)
            );
        }
        
        // Update user
        user.setAccountStatus(AccountStatus.VERIFIED);
        user.setVerifiedBy(getCurrentAdminId());
        user.setVerifiedAt(LocalDateTime.now());
        user.setIsActive(true);
        user.setIsVerified(true);
        
        User updatedUser = userRepository.save(user);
        
        // Send notification
        String message = "✅ Your TruckMitra account has been reactivated. You can now use all features.";
        notificationService.sendNotification(userId, message);
        
        log.info("User {} activated successfully", userId);
        
        return updatedUser;
    }

    @Override
    public User deleteUser(Long userId) {
        log.info("Soft deleting user: {}", userId);
        
        User user = getUserById(userId);
        AccountStatus oldStatus = user.getAccountStatus();
        
        // Validate transition
        if (!isValidTransition(oldStatus, AccountStatus.DELETED)) {
            throw new BadRequestException(
                String.format("Cannot delete user from %s status", oldStatus)
            );
        }
        
        // Soft delete
        user.setAccountStatus(AccountStatus.DELETED);
        user.setIsActive(false);
        
        User deletedUser = userRepository.save(user);
        
        // Send notification
        String message = "🗑️ Your TruckMitra account has been deleted. If you think this is a mistake, please contact support.";
        notificationService.sendNotification(userId, message);
        
        log.info("User {} deleted successfully", userId);
        
        return deletedUser;
    }

    @Override
    public User restoreUser(Long userId) {
        log.info("Restoring user: {}", userId);
        
        User user = getUserById(userId);
        AccountStatus oldStatus = user.getAccountStatus();
        
        // Validate transition
        if (!isValidTransition(oldStatus, AccountStatus.PENDING_VERIFICATION)) {
            throw new BadRequestException(
                String.format("Cannot restore user from %s status", oldStatus)
            );
        }
        
        // Restore user
        user.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
        user.setIsActive(true);
        
        User restoredUser = userRepository.save(user);
        
        // Send notification
        String message = "♻️ Your TruckMitra account has been restored. Please complete your profile and wait for verification.";
        notificationService.sendNotification(userId, message);
        
        log.info("User {} restored successfully", userId);
        
        return restoredUser;
    }

  // src/main/java/com/truckmitra/service/admin/impl/AdminUserServiceImpl.java

@Override
public User updateUserStatus(Long userId, StatusUpdateRequest request) {
    log.info("Updating user {} status to: {}", userId, request.status());
    
    User user = getUserById(userId);
    AccountStatus oldStatus = user.getAccountStatus();
    AccountStatus newStatus = request.status();
    
    // No validation - allow any status change
    log.info("Status change requested: {} → {}", oldStatus, newStatus);
    
    // Update user
    user.setAccountStatus(newStatus);
    
    // Update verification info if applicable
    if (newStatus == AccountStatus.VERIFIED || newStatus == AccountStatus.REJECTED) {
        user.setVerifiedBy(getCurrentAdminId());
        user.setVerifiedAt(LocalDateTime.now());
        user.setIsVerified(newStatus == AccountStatus.VERIFIED);
    }
    
    // Update active status
    user.setIsActive(newStatus != AccountStatus.DELETED);
    
    User updatedUser = userRepository.save(user);
    
    // Send notification
    String message = getStatusChangeMessage(oldStatus, newStatus, request.reason());
    notificationService.sendNotification(userId, message);
    
    log.info("User {} status updated from {} to {}", userId, oldStatus, newStatus);
    
    return updatedUser;
}

private String getStatusChangeMessage(AccountStatus oldStatus, AccountStatus newStatus, String reason) {
    String reasonText = reason != null ? " Reason: " + reason : "";
    
    return switch (newStatus) {
        case VERIFIED -> 
            "🎉 Congratulations! Your TruckMitra account has been verified. You can now use all features including posting loads, bidding, and trips.";
            
        case REJECTED -> 
            "❌ Your TruckMitra account verification has been rejected." + reasonText + 
            " Please update your documents and try again, or contact support at support@truckmitra.com.";
            
        case SUSPENDED -> 
            "⚠️ Your TruckMitra account has been suspended." + reasonText + 
            " Please contact support at support@truckmitra.com for assistance.";
            
        case PENDING_VERIFICATION, PROFILE_COMPLETED -> 
            "⏳ Your TruckMitra account is now pending verification. Our team will review your documents and notify you once verified.";
            
        case REGISTERED -> 
            "📝 Your TruckMitra account has been reset to registered status." + reasonText + 
            " Please complete your profile.";
            
        case DELETED -> 
            "🗑️ Your TruckMitra account has been deleted." + reasonText + 
            " If you think this is a mistake, please contact support.";
	default -> throw new IllegalArgumentException("Unexpected value: " + newStatus);
    };
}

    // ==================== BULK OPERATIONS ====================

   // src/main/java/com/truckmitra/service/admin/impl/AdminUserServiceImpl.java

@Override
public BulkOperationResponse bulkApproveUsers(BulkUserIdsRequest request) {
    // ✅ Ab yeh sahi kaam karega
    List<Long> userIds = request.userIds();
    
    log.info("Bulk approving {} users", userIds.size());
    
    int successCount = 0;
    int failCount = 0;
    
    for (Long userId : userIds) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && 
                user.getAccountStatus() == AccountStatus.PENDING_VERIFICATION) {
                
                user.setAccountStatus(AccountStatus.VERIFIED);
                user.setVerifiedBy(getCurrentAdminId());
                user.setVerifiedAt(LocalDateTime.now());
                user.setIsVerified(true);
                userRepository.save(user);
                
                notificationService.sendNotification(
                    userId,
                    "🎉 Congratulations! Your TruckMitra account has been approved. You can now use all features."
                );
                successCount++;
            } else {
                failCount++;
                log.warn("User {} not found or not in PENDING_VERIFICATION status", userId);
            }
        } catch (Exception e) {
            log.error("Failed to approve user {}: {}", userId, e.getMessage());
            failCount++;
        }
    }
    
    log.info("Bulk approve completed: {} succeeded, {} failed", successCount, failCount);
    
    return new BulkOperationResponse(successCount, failCount);
}

    // ==================== HELPER METHODS ====================

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private Long getCurrentAdminId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("No authenticated user found");
        }
        
        // You need to implement this based on your UserDetails
        // For now, return a default or extract from principal
        return 1L;
    }

    private boolean isValidTransition(AccountStatus oldStatus, AccountStatus newStatus) {
        if (oldStatus == newStatus) {
            return true; // Same status is allowed (no change)
        }
        
        return switch (oldStatus) {
            case REGISTERED -> 
                newStatus == AccountStatus.PENDING_VERIFICATION ||
                newStatus == AccountStatus.VERIFIED ||
                newStatus == AccountStatus.REJECTED ||
                newStatus == AccountStatus.DELETED;
                
            case PENDING_VERIFICATION -> 
                newStatus == AccountStatus.VERIFIED ||
                newStatus == AccountStatus.REJECTED ||
                newStatus == AccountStatus.DELETED;
                
            case VERIFIED -> 
                newStatus == AccountStatus.SUSPENDED ||
                newStatus == AccountStatus.DELETED;
                
            case REJECTED -> 
                newStatus == AccountStatus.PENDING_VERIFICATION ||
                newStatus == AccountStatus.DELETED;
                
            case SUSPENDED -> 
                newStatus == AccountStatus.VERIFIED ||
                newStatus == AccountStatus.DELETED;
                
            case DELETED -> 
                newStatus == AccountStatus.PENDING_VERIFICATION;
		default -> throw new IllegalArgumentException("Unexpected value: " + oldStatus);
        };
    }
//
//    private String getStatusChangeMessage(AccountStatus oldStatus, AccountStatus newStatus, String reason) {
//        String reasonText = reason != null ? " Reason: " + reason : "";
//        
//        return switch (newStatus) {
//            case VERIFIED -> 
//                "🎉 Congratulations! Your TruckMitra account has been verified. You can now use all features including posting loads, bidding, and trips.";
//                
//            case REJECTED -> 
//                "❌ Your TruckMitra account verification has been rejected." + reasonText + 
//                " Please update your documents and try again, or contact support at support@truckmitra.com.";
//                
//            case SUSPENDED -> 
//                "⚠️ Your TruckMitra account has been suspended." + reasonText + 
//                " Please contact support at support@truckmitra.com for assistance.";
//                
//            case PENDING_VERIFICATION -> 
//                "⏳ Your TruckMitra account is now pending verification. You will be notified once verified.";
//                
//            case DELETED -> 
//                "🗑️ Your TruckMitra account has been deleted." + reasonText + 
//                " If you think this is a mistake, please contact support.";
//                
//            default -> "Your account status has been updated to " + newStatus.getDisplayName() + reasonText;
//        };
//    }
}