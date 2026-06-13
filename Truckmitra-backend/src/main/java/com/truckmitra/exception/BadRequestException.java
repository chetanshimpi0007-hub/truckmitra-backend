// src/main/java/com/truckmitra/exception/BadRequestException.java
package com.truckmitra.exception;

import java.util.Map;

public class BadRequestException extends RuntimeException {
    
    private final Map<String, String> errors;

    public BadRequestException(String message) {
        super(message);
        this.errors = null;
    }

    public BadRequestException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}