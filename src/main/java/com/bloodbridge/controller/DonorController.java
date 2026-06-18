package com.bloodbridge.controller;

import com.bloodbridge.dto.donor.DonorLoginRequest;
import com.bloodbridge.dto.donor.DonorLoginResponse;
import com.bloodbridge.dto.donor.DonorRegistrationRequest;
import com.bloodbridge.dto.donor.DonorResponse;
import com.bloodbridge.dto.hospital.HospitalResponse;
import com.bloodbridge.service.DonorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService)
    {
        this.donorService = donorService;
    }

    @PostMapping("/register")
    public DonorResponse registerDonor(@Valid @RequestBody DonorRegistrationRequest request)
    {
        return donorService.registerDonor(request);
    }

    @PostMapping("/login")
    public DonorLoginResponse loginDonor(@RequestBody DonorLoginRequest request)
    {
        return donorService.loginDonor(request);
    }

    @GetMapping("/{id}")
    public DonorResponse getDonorById(@PathVariable Long id)
    {
        return donorService.getDonorById(id);
    }

    @GetMapping("/all-donors")
    public List<DonorResponse> getAllDonors()
    {
        return donorService.getAllDonors();
    }
}
