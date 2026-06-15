package com.bloodbridge.exception;

public class InvalidDonorException extends RuntimeException {
    public InvalidDonorException(String message) {
        super(message);
    }
}
