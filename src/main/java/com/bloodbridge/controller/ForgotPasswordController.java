package com.bloodbridge.controller;

import com.bloodbridge.dto.password.ResetPasswordRequest;
import com.bloodbridge.service.ForgotPasswordOTPService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/forgot-password")
public class ForgotPasswordController {

    private final ForgotPasswordOTPService forgotPasswordOTPService;

    public ForgotPasswordController(ForgotPasswordOTPService forgotPasswordOTPService) {
        this.forgotPasswordOTPService = forgotPasswordOTPService;
    }

    @PostMapping("/send-otp")
    public LocalDateTime sendOTP(String email)
    {
        return forgotPasswordOTPService.sendOTP(email);
    }

    @PostMapping("/reset-password")
    public void resetPassword(ResetPasswordRequest request)
    {
        forgotPasswordOTPService.resetPassword(request);
    }
}
