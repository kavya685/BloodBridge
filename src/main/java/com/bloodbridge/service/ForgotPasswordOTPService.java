package com.bloodbridge.service;

import com.bloodbridge.dto.password.ResetPasswordRequest;

import java.time.LocalDateTime;

public interface ForgotPasswordOTPService {
    String generateOTP();
    LocalDateTime sendOTP(String email);
    void resetPassword(ResetPasswordRequest request);
}
