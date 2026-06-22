package com.truckmitra.service.auth;

import com.truckmitra.entity.auth.PasswordResetToken;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.auth.PasswordResetTokenRepository;
import com.truckmitra.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void generateResetToken(String emailOrMobile) {
        Optional<User> userOpt = userRepository.findByEmail(emailOrMobile);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByMobile(emailOrMobile);
        }

        if (userOpt.isEmpty()) {
            // Don't leak whether user exists or not
            return;
        }

        User user = userOpt.get();
        
        // Delete any existing token for this user
        tokenRepository.deleteByUser(user);

        // Generate 6-digit OTP or UUID token
        String token = UUID.randomUUID().toString();
        
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();
                
        tokenRepository.save(resetToken);

        // Log the token to console as requested until SMTP is configured
        log.info("=========================================================");
        log.info("PASSWORD RESET LINK GENERATED");
        log.info("User: {}", emailOrMobile);
        log.info("Reset Link: http://localhost:3000/reset-password?token={}", token);
        log.info("Token valid for 15 minutes.");
        log.info("=========================================================");
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Invalidate token after successful reset
        tokenRepository.delete(resetToken);
        
        log.info("Password successfully reset for user ID: {}", user.getId());
    }
}
