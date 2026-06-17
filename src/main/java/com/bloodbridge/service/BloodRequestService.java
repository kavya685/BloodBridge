package com.bloodbridge.service;

import com.bloodbridge.dto.bloodRequest.BloodRequestCreateRequest;
import com.bloodbridge.dto.bloodRequest.BloodRequestResponse;

public interface BloodRequestService {
    BloodRequestResponse createBloodRequest(BloodRequestCreateRequest request);

    BloodRequestResponse getBloodRequestById(Long id);
}
