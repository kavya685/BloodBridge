package com.bloodbridge.service;

import com.bloodbridge.dto.donor.DonorLoginRequest;
import com.bloodbridge.dto.donor.DonorLoginResponse;
import com.bloodbridge.dto.donor.DonorRegistrationRequest;
import com.bloodbridge.dto.donor.DonorResponse;

import java.util.List;

public interface DonorService {
    DonorResponse registerDonor(DonorRegistrationRequest request);

    DonorLoginResponse loginDonor(DonorLoginRequest request);

    DonorResponse getDonorById(Long id);

    List<DonorResponse> getAllDonors();
}
