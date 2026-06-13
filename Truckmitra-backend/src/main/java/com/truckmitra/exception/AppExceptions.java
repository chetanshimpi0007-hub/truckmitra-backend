package com.truckmitra.exception;

public class AppExceptions {
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String msg) { super(msg); }
    }
    public static class UnauthorizedActionException extends RuntimeException {
        public UnauthorizedActionException(String msg) { super(msg); }
    }
    public static class DuplicateResourceException extends RuntimeException {
        public DuplicateResourceException(String msg) { super(msg); }
    }
    public static class ValidationException extends RuntimeException {
        public ValidationException(String msg) { super(msg); }
    }
    public static class InvalidRoleException extends RuntimeException {
        public InvalidRoleException(String msg) { super(msg); }
    }
}
