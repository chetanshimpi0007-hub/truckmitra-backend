// src/main/java/com/truckmitra/config/JpaAuditingConfig.java
package com.truckmitra.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.domain.AuditorAware;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.util.Optional;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfig {

    @Bean
    public AuditorAware<Long> auditorProvider() {
        return new SpringSecurityAuditorAware();
    }
}

class SpringSecurityAuditorAware implements AuditorAware<Long> {

    @Override
    public Optional<Long> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        // Agar user authenticated hai to uski ID return karo
        try {
            if (authentication.getPrincipal() instanceof com.truckmitra.security.CustomUserDetails) {
                com.truckmitra.security.CustomUserDetails userDetails = (com.truckmitra.security.CustomUserDetails) authentication.getPrincipal();
                return Optional.of(userDetails.getId());
            }
            return Optional.of(1L); // Fallback for system operations
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}