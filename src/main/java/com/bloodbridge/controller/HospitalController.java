package com.bloodbridge.controller;

import com.bloodbridge.dto.hospital.*;
import com.bloodbridge.service.HospitalService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {
    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService)
    {
        this.hospitalService = hospitalService;
    }

    @PostMapping
    public HospitalResponse registerHospital(@Valid @RequestBody HospitalRegistrationRequest request)
    {
        return hospitalService.registerHospital(request);
    }

    @PostMapping("/login")
    public HospitalLoginResponse loginHospital(@Valid @RequestBody HospitalLoginRequest request)
    {
        return hospitalService.loginHospital(request);
    }

    @GetMapping("/my")
    public HospitalResponse getHospitalById()
    {
        return hospitalService.getHospitalById();
    }

    @GetMapping("/dashboard")
    public HospitalDashboardResponse getDashboard()
    {
        return hospitalService.getDashboard();
    }

    @PutMapping("/change-password")
    public void changePassword(@Valid @RequestBody HospitalChangePasswordRequest request) {

        hospitalService.changePassword(request);
    }

    @PutMapping("/change-password-request")
    public void changePasswordRequest(@Valid @RequestBody HospitalChangePasswordRequest request) {

        hospitalService.changePasswordRequest(request);
    }

    @PutMapping("/me")
    public HospitalResponse updateProfile(
            @Valid @RequestBody HospitalProfileUpdateRequest request) {

        return hospitalService.updateProfile(request);
    }
}
