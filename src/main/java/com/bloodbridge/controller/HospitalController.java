package com.bloodbridge.controller;

import com.bloodbridge.entity.Hospital;
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
    public Hospital registerHospital(@RequestBody Hospital hospital)
    {
        return hospitalService.registerHospital(hospital);
    }
}
