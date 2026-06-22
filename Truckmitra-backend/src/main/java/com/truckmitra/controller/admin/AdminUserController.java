// src/main/java/com/truckmitra/controller/admin/AdminUserController.java
package com.truckmitra.controller.admin;

import com.truckmitra.dto.admin.request.*;
import com.truckmitra.dto.admin.response.BulkOperationResponse;
import com.truckmitra.dto.admin.response.UserDetailResponse;
import com.truckmitra.dto.admin.response.UserStatsResponse;
import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.auth.UserRepository;
import com.truckmitra.service.admin.AdminUserService;
import com.truckmitra.service.PdfService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final UserRepository userRepository;
    private final PdfService pdfService;

    // ==================== GET OPERATIONS ====================

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<Page<User>>> getPendingUsers(
            @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        Page<User> pendingUsers = adminUserService.getPendingUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success("Pending users fetched successfully", pendingUsers));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<UserStatsResponse>> getUserStats() {
        UserStatsResponse stats = adminUserService.getUserStats();
        return ResponseEntity.ok(ApiResponse.success("User statistics fetched successfully", stats));
    }
 // src/main/java/com/truckmitra/controller/admin/AdminUserController.java

    /**
     * Get dashboard statistics - all counts in one endpoint
     */
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getDashboardStats() {
        log.info("Fetching dashboard statistics");
        
        long registeredCount = userRepository.countByAccountStatus(AccountStatus.REGISTERED);
        long pendingCount = userRepository.countByAccountStatus(AccountStatus.PENDING_VERIFICATION) +
                            userRepository.countByAccountStatus(AccountStatus.REGISTERED) +
                            userRepository.countByAccountStatus(AccountStatus.PROFILE_COMPLETED);
        long verifiedCount = userRepository.countByAccountStatus(AccountStatus.VERIFIED);
        long rejectedCount = userRepository.countByAccountStatus(AccountStatus.REJECTED);
        long suspendedCount = userRepository.countByAccountStatus(AccountStatus.SUSPENDED);
        long deletedCount = userRepository.countByAccountStatus(AccountStatus.DELETED);
        long totalCount = userRepository.count();
        
        Map<String, Long> stats = new HashMap<>();
        stats.put("registered", registeredCount);
        stats.put("pending", pendingCount);
        stats.put("verified", verifiedCount);
        stats.put("approved", verifiedCount); // For backward compatibility
        stats.put("rejected", rejectedCount);
        stats.put("suspended", suspendedCount);
        stats.put("deleted", deletedCount);
        stats.put("total", totalCount);
        
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched successfully", stats));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<Page<User>>> getUsersByStatus(
            @PathVariable AccountStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<User> users = adminUserService.getUsersByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(
            String.format("Users with status %s fetched successfully", status), 
            users
        ));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDetailResponse>> getUserDetails(@PathVariable Long userId) {
        UserDetailResponse userDetails = adminUserService.getUserDetails(userId);
        return ResponseEntity.ok(ApiResponse.success("User details fetched successfully", userDetails));
    }

    @GetMapping("/{userId}/snapshot")
    public ResponseEntity<ApiResponse<com.truckmitra.dto.response.admin.UserFinancialSnapshotDto>> getUserFinancialSnapshot(@PathVariable Long userId) {
        com.truckmitra.dto.response.admin.UserFinancialSnapshotDto snapshot = adminUserService.getUserFinancialSnapshot(userId);
        return ResponseEntity.ok(ApiResponse.success("User financial snapshot fetched successfully", snapshot));
    }

    @GetMapping("/{userId}/trips")
    public ResponseEntity<ApiResponse<Page<com.truckmitra.entity.load.Trip>>> getUserTrips(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<com.truckmitra.entity.load.Trip> trips = adminUserService.getUserTrips(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("User trips fetched successfully", trips));
    }

    @GetMapping("/{userId}/payments")
    public ResponseEntity<ApiResponse<Page<com.truckmitra.dto.response.wallet.TransactionResponse>>> getUserPayments(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<com.truckmitra.dto.response.wallet.TransactionResponse> transactions = adminUserService.getUserPayments(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("User payments fetched successfully", transactions));
    }

    @GetMapping("/{userId}/timeline")
    public ResponseEntity<ApiResponse<Page<com.truckmitra.entity.AuditLog>>> getUserTimeline(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<com.truckmitra.entity.AuditLog> timeline = adminUserService.getUserTimeline(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("User timeline fetched successfully", timeline));
    }

    @GetMapping("/{userId}/invoices")
    public ResponseEntity<ApiResponse<Page<com.truckmitra.entity.load.Trip>>> getUserInvoices(
            @PathVariable Long userId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<com.truckmitra.entity.load.Trip> invoices = adminUserService.getUserInvoices(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("User invoices fetched successfully", invoices));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<User>>> getAllUsers(
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<User> users = adminUserService.getAllUsers(status, role, search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", users));
    }

    @GetMapping("/{userId}/registration-pdf")
    public ResponseEntity<byte[]> downloadRegistrationPdf(@PathVariable Long userId) {
        log.info("Generating registration PDF for user: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            byte[] pdfContents = pdfService.generateUserRegistrationPdf(user);
            
            String filename = "registration_" + user.getFullName().replaceAll("\\s+", "_") + ".pdf";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfContents);
        } catch (Exception e) {
            log.error("Error generating registration PDF", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== STATUS UPDATE OPERATIONS ====================
 // src/main/java/com/truckmitra/controller/admin/AdminUserController.java

    @PutMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody StatusUpdateRequest request) {
        User updatedUser = adminUserService.updateUserStatus(userId, request);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updatedUser));
    }

    @PutMapping("/{userId}/approve")
    public ResponseEntity<ApiResponse<User>> approveUser(@PathVariable Long userId) {
        User updatedUser = adminUserService.approveUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User approved successfully", updatedUser));
    }

    @PutMapping("/{userId}/reject")
    public ResponseEntity<ApiResponse<User>> rejectUser(
            @PathVariable Long userId,
            @Valid @RequestBody RejectRequest request) {
        User updatedUser = adminUserService.rejectUser(userId, request);
        return ResponseEntity.ok(ApiResponse.success("User rejected successfully", updatedUser));
    }

    @PutMapping("/{userId}/suspend")
    public ResponseEntity<ApiResponse<User>> suspendUser(
            @PathVariable Long userId,
            @Valid @RequestBody SuspendRequest request) {
        User updatedUser = adminUserService.suspendUser(userId, request);
        return ResponseEntity.ok(ApiResponse.success("User suspended successfully", updatedUser));
    }

    @PutMapping("/{userId}/activate")
    public ResponseEntity<ApiResponse<User>> activateUser(@PathVariable Long userId) {
        User updatedUser = adminUserService.activateUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User activated successfully", updatedUser));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> deleteUser(@PathVariable Long userId) {
        User deletedUser = adminUserService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", deletedUser));
    }

    @PutMapping("/{userId}/restore")
    public ResponseEntity<ApiResponse<User>> restoreUser(@PathVariable Long userId) {
        User restoredUser = adminUserService.restoreUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User restored successfully", restoredUser));
    }
//
//    @PutMapping("/{userId}/status")
//    public ResponseEntity<ApiResponse<User>> updateUserStatus(
//            @PathVariable Long userId,
//            @Valid @RequestBody StatusUpdateRequest request) {
//        User updatedUser = adminUserService.updateUserStatus(userId, request);
//        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updatedUser));
//    }

    // ==================== BULK OPERATIONS ====================

    @PutMapping("/bulk/approve")
    public ResponseEntity<ApiResponse<BulkOperationResponse>> bulkApproveUsers(
            @Valid @RequestBody BulkUserIdsRequest request) {
        BulkOperationResponse response = adminUserService.bulkApproveUsers(request);
        return ResponseEntity.ok(ApiResponse.success(
            String.format("Bulk approve completed: %d succeeded, %d failed", 
                         response.successCount(), response.failCount()),
            response
        ));
    }
}