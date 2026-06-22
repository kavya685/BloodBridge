package com.bloodbridge.service;

import com.bloodbridge.dto.donationApplication.DonationApplicationCreateRequest;
import com.bloodbridge.dto.donationApplication.DonationApplicationResponse;

import java.util.List;

public interface DonationApplicationService {
    DonationApplicationResponse createDonationApplication(DonationApplicationCreateRequest request);

    DonationApplicationResponse getDonationApplicationById(Long id);

    List<DonationApplicationResponse> getAllDonationApplications();
}
