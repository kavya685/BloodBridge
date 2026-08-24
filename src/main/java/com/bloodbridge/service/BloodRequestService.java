package com.bloodbridge.service;

import com.bloodbridge.dto.bloodRequest.BloodRequestCreateRequest;
import com.bloodbridge.dto.bloodRequest.BloodRequestResponse;
import com.bloodbridge.dto.bloodRequest.BloodRequestUpdateRequest;

import java.util.List;

public interface BloodRequestService {
    BloodRequestResponse createBloodRequest(BloodRequestCreateRequest request);

    BloodRequestResponse getBloodRequestById(Long id);

    List<BloodRequestResponse> getAllBloodRequests();

    List<BloodRequestResponse> getMyBloodRequests();

    void deleteBloodRequest(Long id);

    BloodRequestResponse updateBloodRequest(Long bloodRequestId, BloodRequestUpdateRequest request);
}
