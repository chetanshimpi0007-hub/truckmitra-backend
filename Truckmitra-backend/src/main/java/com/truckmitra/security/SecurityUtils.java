package com.truckmitra.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Set;
import java.util.stream.Collectors;

public final class SecurityUtils {
    private static final Logger log = LoggerFactory.getLogger(SecurityUtils.class);

    private SecurityUtils() {}

    public static Long getCurrentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) return null;
            Object principal = auth.getPrincipal();
            // If CustomUserDetails is used and exposes getId()
            try {
                Class<?> cls = principal.getClass();
                java.lang.reflect.Method m = cls.getMethod("getId");
                Object id = m.invoke(principal);
                if (id instanceof Number) return ((Number) id).longValue();
                if (id instanceof String) return Long.parseLong((String) id);
            } catch (Exception ignored) {
                // fallback to parsing principal.toString()
            }
            String p = String.valueOf(principal);
            try { return Long.parseLong(p); } catch (Exception e) { return null; }
        } catch (Exception e) {
            log.debug("Failed to extract user id from security context: {}", e.getMessage());
            return null;
        }
    }

    public static String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        return principal != null ? principal.toString() : null;
    }

    public static Set<String> getCurrentUserRoles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return Set.of();
        return auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
    }
}
