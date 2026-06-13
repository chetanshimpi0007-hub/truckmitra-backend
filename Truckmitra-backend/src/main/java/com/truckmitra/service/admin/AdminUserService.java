// src/main/java/com/truckmitra/service/admin/AdminUserService.java
package com.truckmitra.service.admin;

import com.truckmitra.dto.admin.request.*;
import com.truckmitra.dto.admin.response.BulkOperationResponse;
import com.truckmitra.dto.admin.response.UserDetailResponse;
import com.truckmitra.dto.admin.response.UserStatsResponse;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;
import com.truckmitra.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    
    // ==================== GET OPERATIONS ====================
    
    Page<User> getPendingUsers(Pageable pageable);
    
    UserStatsResponse getUserStats();
    
    Page<User> getUsersByStatus(AccountStatus status, Pageable pageable);
    
    UserDetailResponse getUserDetails(Long userId);
    
    Page<User> getAllUsers(AccountStatus status, Role role, String search, Pageable pageable);
    
    // ==================== STATUS UPDATE OPERATIONS ====================
    
    User approveUser(Long userId);
    
    User rejectUser(Long userId, RejectRequest request);
    
    User suspendUser(Long userId, SuspendRequest request);
    
    User activateUser(Long userId);
    
    User deleteUser(Long userId);
    
    User restoreUser(Long userId);
    
    User updateUserStatus(Long userId, StatusUpdateRequest request);
    
    // ==================== BULK OPERATIONS ====================
    
    BulkOperationResponse bulkApproveUsers(BulkUserIdsRequest request);
}