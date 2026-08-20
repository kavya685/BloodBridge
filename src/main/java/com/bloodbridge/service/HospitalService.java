package com.bloodbridge.service;

import com.bloodbridge.dto.hospital.*;

import java.util.List;

public interface HospitalService {
    HospitalResponse registerHospital(HospitalRegistrationRequest request);

    HospitalLoginResponse loginHospital(HospitalLoginRequest request);

    HospitalResponse getHospitalById();

    HospitalDashboardResponse getDashboard();

}
