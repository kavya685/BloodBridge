package com.bloodbridge.service;

import com.bloodbridge.dto.donor.*;

import java.util.List;

public interface DonorService {
    DonorResponse registerDonor(DonorRegistrationRequest request);

    DonorLoginResponse loginDonor(DonorLoginRequest request);

    DonorResponse getDonorById();

    DonorDashboardResponse getDashboard();

    DonorEligibilityResponse getEligibility();

}
