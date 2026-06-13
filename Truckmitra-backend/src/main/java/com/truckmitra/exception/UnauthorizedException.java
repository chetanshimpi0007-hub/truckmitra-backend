// src/main/java/com/truckmitra/exception/UnauthorizedException.java
package com.truckmitra.exception;

public class UnauthorizedException extends RuntimeException {
    
    private final String requiredRole;
    private final String userRole;

    public UnauthorizedException(String message) {
        super(message);
        this.requiredRole = null;
        this.userRole = null;
    }

    public UnauthorizedException(String requiredRole, String userRole) {
        super(String.format("Access denied. Required role: %s, User role: %s", requiredRole, userRole));
        this.requiredRole = requiredRole;
        this.userRole = userRole;
    }

    public String getRequiredRole() {
        return requiredRole;
    }

    public String getUserRole() {
        return userRole;
    }
}