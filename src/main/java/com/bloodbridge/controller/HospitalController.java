package com.bloodbridge.controller;

import com.bloodbridge.dto.hospital.HospitalLoginRequest;
import com.bloodbridge.dto.hospital.HospitalLoginResponse;
import com.bloodbridge.dto.hospital.HospitalRegistrationRequest;
import com.bloodbridge.dto.hospital.HospitalResponse;
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

    @PostMapping("/register")
    public HospitalResponse registerHospital(@Valid @RequestBody HospitalRegistrationRequest request)
    {
        return hospitalService.registerHospital(request);
    }

    @PostMapping("/login")
    public HospitalLoginResponse loginHospital(@RequestBody HospitalLoginRequest request)
    {
        return hospitalService.loginHospital(request);
    }

    @GetMapping("/{id}")
    public HospitalResponse getHospitalById(@PathVariable Long id)
    {
        return hospitalService.getHospitalById(id);
    }

    @GetMapping("/all-hospitals")
    public List<HospitalResponse> getAllHospitals()
    {
        return hospitalService.getAllHospitals();
    }
}
