package com.bloodbridge.service;

import com.bloodbridge.dto.donationApplication.DonationApplicationCreateRequest;
import com.bloodbridge.dto.donationApplication.DonationApplicationResponse;
import com.bloodbridge.entity.DonationApplication;

import java.util.List;

public interface DonationApplicationService {
    DonationApplicationResponse createDonationApplication(DonationApplicationCreateRequest request);

    DonationApplicationResponse getDonationApplicationById(Long id);

    // TODO: Verify that the authenticated hospital owns this blood request
    // before returning its applications.
    List<DonationApplicationResponse> getApplicationsByBloodRequest(Long bloodRequestId);

    List<DonationApplicationResponse> getApplicationsByDonor(Long donorId);

    // TODO: Verify that the authenticated hospital owns this application's
    // blood request before accepting/rejecting.
    DonationApplicationResponse acceptApplication(Long applicationId);

    DonationApplicationResponse rejectApplication(Long applicationId);

    List<DonationApplicationResponse> getMyApplications();

    void deleteDonationApplication(Long applicationId);
}
