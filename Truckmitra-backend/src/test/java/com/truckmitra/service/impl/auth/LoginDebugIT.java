package com.truckmitra.service.impl.auth;

import com.truckmitra.dto.request.auth.LoginRequest;
import com.truckmitra.entity.common.enums.LoginType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

@SpringBootTest
public class LoginDebugIT {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthServiceImpl authService;

    @Test
    public void testAuthenticationManager() {
        System.out.println("====== DEBUGGING praju@gmail.com ======");
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("praju@gmail.com", "Password123!") // Or whatever password
            );
            System.out.println("Auth successful: " + auth.isAuthenticated());
        } catch (Exception e) {
            System.out.println("Auth Failed! Exception: " + e.getClass().getName());
            System.out.println("Message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
