package com.bloodbridge.exception;

public class InvalidBloodRequestException extends RuntimeException {
    public InvalidBloodRequestException(String message) {
        super(message);
    }
}
