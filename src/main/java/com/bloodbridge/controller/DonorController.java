package com.bloodbridge.controller;

import com.bloodbridge.dto.donor.DonorRegistrationRequest;
import com.bloodbridge.dto.donor.DonorResponse;
import com.bloodbridge.dto.hospital.HospitalResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    @PostMapping("/register")
    public DonorResponse registerDonor(DonorRegistrationRequest request)
    {

    }
}
