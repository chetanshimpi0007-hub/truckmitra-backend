// src/main/java/com/truckmitra/repository/auth/UserRepository.java
package com.truckmitra.repository.auth;

import com.truckmitra.entity.user.User;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find by mobile
    Optional<User> findByMobile(String mobile);

    // Find by email
    Optional<User> findByEmail(String email);

    // Check existence
    boolean existsByMobile(String mobile);
    boolean existsByEmail(String email);
    
 // src/main/java/com/truckmitra/repository/auth/UserRepository.java


    @Query("SELECT u FROM User u WHERE u.accountStatus IN :statuses")
    Page<User> findByAccountStatusIn(@Param("statuses") List<AccountStatus> statuses, 
                                      Pageable pageable);

    // OAuth2 find methods
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByFacebookId(String facebookId);

    // Pagination methods for admin
    Page<User> findByAccountStatus(AccountStatus status, Pageable pageable);
    
    Page<User> findByRole(Role role, Pageable pageable);
    
    long countByAccountStatus(AccountStatus status);
    
    @Query("SELECT u FROM User u WHERE u.accountStatus = :status AND u.role = :role")
    Page<User> findByAccountStatusAndRole(@Param("status") AccountStatus status, 
                                           @Param("role") Role role, 
                                           Pageable pageable);

    // Find by email or mobile
    @Query("SELECT u FROM User u WHERE u.email = :email OR u.mobile = :mobile")
    Optional<User> findByEmailOrMobile(@Param("email") String email, @Param("mobile") String mobile);

    // Check existence for OAuth2
    boolean existsByGoogleId(String googleId);
    boolean existsByFacebookId(String facebookId);

    // Find by mobile and role
    @Query("SELECT u FROM User u WHERE u.mobile = :mobile AND u.role = :role")
    Optional<User> findByMobileAndRole(@Param("mobile") String mobile, @Param("role") Role role);

    // Update methods
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :now, u.lastLoginIp = :ip WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("now") LocalDateTime now, @Param("ip") String ip);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.mobile = :mobile")
    void incrementFailedAttempts(@Param("mobile") String mobile);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = 0, u.lockoutTime = null WHERE u.mobile = :mobile")
    void resetFailedAttempts(@Param("mobile") String mobile);

    @Modifying
    @Query("UPDATE User u SET u.refreshToken = :refreshToken WHERE u.id = :userId")
    void updateRefreshToken(@Param("userId") Long userId, @Param("refreshToken") String refreshToken);

	Page<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContaining(String search,
			String search2, String search3, Pageable pageable);
}