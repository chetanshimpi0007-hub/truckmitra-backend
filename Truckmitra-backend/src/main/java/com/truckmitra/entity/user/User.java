// src/main/java/com/truckmitra/entity/user/User.java
package com.truckmitra.entity.user;

import jakarta.persistence.Column;
import com.truckmitra.entity.common.BaseEntity;
import com.truckmitra.entity.common.enums.AccountStatus;
import com.truckmitra.entity.common.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lombok.Builder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import com.truckmitra.entity.notification.EmergencyAlert;
import com.truckmitra.entity.chat.ChatMessage;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users",
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_mobile", columnNames = "mobile"),
           @UniqueConstraint(name = "uk_email", columnNames = "email")
       },
       indexes = {
           @Index(name = "idx_mobile", columnList = "mobile"),
           @Index(name = "idx_email", columnList = "email"),
           @Index(name = "idx_role", columnList = "role"),
           @Index(name = "idx_user_status", columnList = "accountStatus")
       })
@Inheritance(strategy = InheritanceType.JOINED)
@SQLDelete(sql = "UPDATE users SET is_deleted = true, deleted_at = NOW() WHERE id = ?")
@Where(clause = "is_deleted = false")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fullname", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 10)
    private String mobile;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "accountstatus", nullable = false, length = 20)
    private AccountStatus accountStatus;

    @Column(name = "profileimageurl")
    private String profileImageUrl;

    private String address;
    private String landmark;
    private String area;

    private String city;
    
    private String state;
    
    private String pincode;

    @Column(name = "lastloginat")
    private LocalDateTime lastLoginAt;

    @Column(name = "devicetoken")
    private String deviceToken;

    @Builder.Default
    @Column(name = "ismobileverified", nullable = false)
    private Boolean isMobileVerified = false;

    @Column(name = "isemailverified")
    @Builder.Default
    private Boolean isEmailVerified = false;

    @Column(name = "failedloginattempts")
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    @Column(name = "lockouttime")
    private LocalDateTime lockoutTime;

    @Column(name = "refreshtoken")
    private String refreshToken;

    // OAuth2 fields
    @Column(name = "googleid", unique = true)
    private String googleId;

    @Column(name = "facebookid", unique = true)
    private String facebookId;

    @Builder.Default
    @Column(name = "isgooglelogin", nullable = false)
    private Boolean isGoogleLogin = false;

    @Builder.Default
    @Column(name = "isfacebooklogin", nullable = false)
    private Boolean isFacebookLogin = false;

    @Builder.Default
    @Column(name = "preferredlogintype", nullable = false)
    private String preferredLoginType = "EMAIL_PASSWORD";

    @Column(name = "lastotpsentat")
    private LocalDateTime lastOtpSentAt;

    @Column(name = "otpattempts")
    @Builder.Default
    private Integer otpAttempts = 0;

    // Preference fields
    @Column(name = "preferredlanguage", length = 20)
    private String preferredLanguage;

    @Column(name = "pushnotificationsenabled")
    @Builder.Default
    private Boolean pushNotificationsEnabled = true;

    @Column(name = "emailnotificationsenabled")
    @Builder.Default
    private Boolean emailNotificationsEnabled = true;

    @Column(name = "smsnotificationsenabled")
    @Builder.Default
    private Boolean smsNotificationsEnabled = true;

    // Metadata
    @Column(name = "registeredip")
    private String registeredIp;

    @Column(name = "registeredat")
    private LocalDateTime registeredAt;

    @Column(name = "lastloginip")
    private String lastLoginIp;
    
    @Column(name = "verifiedby")
    private Long verifiedBy;      // Admin ID who verified the user
    @Column(name = "verifiedat")
    private LocalDateTime verifiedAt; // When the user was verified
    
    @Column(name = "emergency_alerts")
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "driver", fetch = FetchType.LAZY)
    @Builder.Default
    private List<EmergencyAlert> emergencyAlerts = new ArrayList<>();

    @Column(name = "sent_messages")
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ChatMessage> sentMessages = new ArrayList<>();

    @Column(name = "received_messages")
    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ChatMessage> receivedMessages = new ArrayList<>();
    
 // src/main/java/com/truckmitra/entity/user/User.java
 // Add these fields

 @Builder.Default
 @Column(name = "isprofilecompleted", nullable = false)
 private Boolean isProfileCompleted = false;  // ✅ Profile completion status

 @Builder.Default
 @Column(name = "isverified", nullable = false)
 private Boolean isVerified = false;  // ✅ Admin verification status

 // Helper method to check if user can use business features
 public boolean canUseBusinessFeatures() {
     return this.accountStatus == AccountStatus.VERIFIED && this.isVerified;
 }

 // Helper method to get business feature restriction message
 public String getBusinessFeatureMessage() {
     if (this.accountStatus == AccountStatus.REGISTERED) {
         return "Please complete your profile (add vehicle/documents) to access this feature.";
     }
     if (this.accountStatus == AccountStatus.PROFILE_COMPLETED) {
         return "Your account is pending verification. You will be able to use this feature after admin approval.";
     }
     if (this.accountStatus == AccountStatus.REJECTED) {
         return "Your verification was rejected. Please contact support.";
     }
     if (this.accountStatus == AccountStatus.SUSPENDED) {
         return "Your account is suspended. Please contact support.";
     }
     return "You don't have permission to use this feature.";
 }

    public void incrementFailedAttempts() {
        this.failedLoginAttempts = (this.failedLoginAttempts == null ? 1 : this.failedLoginAttempts + 1);
        if (this.failedLoginAttempts >= 5) {
            this.lockoutTime = LocalDateTime.now().plusMinutes(30);
        }
    }

    public void resetFailedAttempts() {
        this.failedLoginAttempts = 0;
        this.lockoutTime = null;
    }

    public boolean isLocked() {
        return lockoutTime != null && lockoutTime.isAfter(LocalDateTime.now());
    }

    public void updateLastLogin(String ip) {
        this.lastLoginAt = LocalDateTime.now();
        this.lastLoginIp = ip;
        this.resetFailedAttempts();
    }

}