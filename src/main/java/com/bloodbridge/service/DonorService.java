package com.bloodbridge.service;

import com.bloodbridge.dto.donor.DonorRegistrationRequest;
import com.bloodbridge.dto.donor.DonorResponse;

public interface DonorService {
    public DonorResponse registerDonor(DonorRegistrationRequest request);
}
