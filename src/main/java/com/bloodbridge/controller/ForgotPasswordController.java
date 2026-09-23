package com.bloodbridge.controller;

import com.bloodbridge.dto.password.ResetPasswordRequest;
import com.bloodbridge.service.ForgotPasswordOTPService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/forgot-password")
public class ForgotPasswordController {

    private final ForgotPasswordOTPService forgotPasswordOTPService;

    public ForgotPasswordController(
            ForgotPasswordOTPService forgotPasswordOTPService) {
        this.forgotPasswordOTPService = forgotPasswordOTPService;
    }

    @PostMapping("/send-otp")
    public LocalDateTime sendOTP(@RequestParam String email) {

        return forgotPasswordOTPService.sendOTP(email);
    }

    @PostMapping("/verify-otp")
    public boolean verifyOTP(
            @RequestParam String email,
            @RequestParam String otp) {

        return forgotPasswordOTPService.verifyOTP(email, otp);
    }

    @PostMapping("/reset-password")
    public void resetPassword(
            @RequestBody ResetPasswordRequest request) {

        forgotPasswordOTPService.resetPassword(
                request.getEmail(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );
    }
}