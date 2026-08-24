package com.bloodbridge.controller;

import com.bloodbridge.dto.donor.*;
import com.bloodbridge.service.DonorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
