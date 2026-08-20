package com.bloodbridge.controller;

import com.bloodbridge.dto.hospital.*;
import com.bloodbridge.service.HospitalService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
