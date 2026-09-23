package com.bloodbridge.service;

import com.bloodbridge.dto.password.ResetPasswordRequest;

import java.time.LocalDateTime;

public interface ForgotPasswordOTPService {
    String generateOTP();
    LocalDateTime sendOTP(String email);
    boolean verifyOTP(String email, String otp);
    void resetPassword(String email, String password, String confirmPassword);
}
