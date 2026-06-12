package com.bloodbridge.service;

import com.bloodbridge.dto.hospital.HospitalRegistrationRequest;
import com.bloodbridge.dto.hospital.HospitalResponse;

public interface HospitalService {
    HospitalResponse registerHospital(HospitalRegistrationRequest request);
}
