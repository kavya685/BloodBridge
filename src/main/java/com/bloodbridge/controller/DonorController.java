package com.bloodbridge.controller;

import com.bloodbridge.dto.donor.*;
import com.bloodbridge.service.DonorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService)
    {
        this.donorService = donorService;
    }

    @PostMapping
    public DonorResponse registerDonor(@Valid @RequestBody DonorRegistrationRequest request)
    {
        return donorService.registerDonor(request);
    }

    @PostMapping("/login")
    public DonorLoginResponse loginDonor(@Valid @RequestBody DonorLoginRequest request)
    {
        return donorService.loginDonor(request);
    }

    @GetMapping("/my")
    public DonorResponse getDonorById()
    {
        return donorService.getDonorById();
    }

    @GetMapping("/dashboard")
    public DonorDashboardResponse getDashboard()
    {
        return donorService.getDashboard();
    }

    @GetMapping("/eligibility")
    public DonorEligibilityResponse getEligibility()
    {
        return donorService.getEligibility();
    }

    @PutMapping("/change-password")
    public void changePassword(@Valid @RequestBody DonorChangePasswordRequest request) {

        donorService.changePassword(request);
    }

    @PutMapping("change-password-request")
    public void changePasswordRequest(@Valid @RequestBody DonorChangePasswordRequest request)
    {
        donorService.changePasswordRequest(request);
    }

    @PutMapping("/me")
    public DonorResponse updateProfile(
            @Valid @RequestBody DonorProfileUpdateRequest request) {

        return donorService.updateProfile(request);
    }
}
