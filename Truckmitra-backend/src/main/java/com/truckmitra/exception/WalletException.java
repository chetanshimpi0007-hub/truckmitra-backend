// src/main/java/com/truckmitra/exception/WalletException.java
package com.truckmitra.exception;

public class WalletException extends RuntimeException {
    
    private final String walletNumber;
    private final String errorCode;

    public WalletException(String message) {
        super(message);
        this.walletNumber = null;
        this.errorCode = "WALLET_ERROR";
    }

    public WalletException(String message, String walletNumber) {
        super(message);
        this.walletNumber = walletNumber;
        this.errorCode = "WALLET_ERROR";
    }

    public WalletException(String message, String walletNumber, String errorCode) {
        super(message);
        this.walletNumber = walletNumber;
        this.errorCode = errorCode;
    }

    public String getWalletNumber() {
        return walletNumber;
    }

    public String getErrorCode() {
        return errorCode;
    }
}