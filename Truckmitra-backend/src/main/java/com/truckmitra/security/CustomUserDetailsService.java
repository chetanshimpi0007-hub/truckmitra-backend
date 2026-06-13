// src/main/java/com/truckmitra/security/CustomUserDetailsService.java
package com.truckmitra.security;

import com.truckmitra.entity.user.User;
import com.truckmitra.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Loading user by username: {}", username);
        
        // Try to find by mobile first (for OTP/Phone login)
        User user = userRepository.findByMobile(username).orElse(null);
        
        // If not found by mobile, try by email (for email/password login)
        if (user == null) {
            user = userRepository.findByEmail(username).orElseThrow(() -> 
                new UsernameNotFoundException("User not found with username: " + username));
        }

        log.debug("User found: {} with role: {}", user.getMobile(), user.getRole());

        String usernameToUse = user.getMobile() != null ? user.getMobile() : user.getEmail();
        String passwordToUse = user.getPassword() != null ? user.getPassword() : "";

        return new CustomUserDetails(
                usernameToUse,
                passwordToUse,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                user.getId()
        );
    }

    public UserDetails loadUserById(Long userId) {
        log.debug("Loading user by id: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        String usernameToUse = user.getMobile() != null ? user.getMobile() : user.getEmail();
        String passwordToUse = user.getPassword() != null ? user.getPassword() : "";

        return new CustomUserDetails(
                usernameToUse,
                passwordToUse,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                user.getId()
        );
    }
}