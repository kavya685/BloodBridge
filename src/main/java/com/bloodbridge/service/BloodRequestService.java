package com.bloodbridge.service;

import com.bloodbridge.dto.bloodRequest.BloodRequestCreateRequest;
import com.bloodbridge.dto.bloodRequest.BloodRequestResponse;

import java.util.List;

public interface BloodRequestService {
    BloodRequestResponse createBloodRequest(BloodRequestCreateRequest request);

    BloodRequestResponse getBloodRequestById(Long id);

    List<BloodRequestResponse> getAllBloodRequests();

    List<BloodRequestResponse> getMyBloodRequests();
}
