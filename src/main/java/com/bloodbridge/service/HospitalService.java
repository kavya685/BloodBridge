package com.bloodbridge.service;

import com.bloodbridge.dto.hospital.HospitalLoginRequest;
import com.bloodbridge.dto.hospital.HospitalLoginResponse;
import com.bloodbridge.dto.hospital.HospitalRegistrationRequest;
import com.bloodbridge.dto.hospital.HospitalResponse;
import com.bloodbridge.entity.Hospital;

import java.util.Optional;

public interface HospitalService {
    HospitalResponse registerHospital(HospitalRegistrationRequest request);
    HospitalLoginResponse loginHospital(HospitalLoginRequest request);
}
