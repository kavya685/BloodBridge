package com.bloodbridge.service;

import com.bloodbridge.dto.hospital.HospitalRegistrationRequest;
import com.bloodbridge.dto.hospital.HospitalRegistrationResponse;
import com.bloodbridge.entity.Hospital;

public interface HospitalService {
    HospitalRegistrationResponse registerHospital(HospitalRegistrationRequest request);
}
