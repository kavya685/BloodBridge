package com.bloodbridge.controller;

import com.bloodbridge.dto.hospital.HospitalRegistrationRequest;
import com.bloodbridge.dto.hospital.HospitalRegistrationResponse;
import com.bloodbridge.service.HospitalService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {
    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService)
    {
        this.hospitalService = hospitalService;
    }

    @PostMapping("/register")
    public HospitalRegistrationResponse registerHospital(@RequestBody HospitalRegistrationRequest request)
    {
        return hospitalService.registerHospital(request);
    }
}
