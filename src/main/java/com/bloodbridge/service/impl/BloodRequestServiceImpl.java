package com.bloodbridge.service.impl;

import com.bloodbridge.dto.bloodRequest.BloodRequestCreateRequest;
import com.bloodbridge.dto.bloodRequest.BloodRequestResponse;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.enums.BloodRequestStatus;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.HospitalRepository;
import com.bloodbridge.service.BloodRequestService;

import java.time.LocalDateTime;

public class BloodRequestServiceImpl implements BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final HospitalRepository hospitalRepository;

    public BloodRequestServiceImpl(BloodRequestRepository bloodRequestRepository,
                                   HospitalRepository hospitalRepository)
    {
        this.bloodRequestRepository = bloodRequestRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public BloodRequestResponse createBloodRequest(BloodRequestCreateRequest request)
    {
        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + request.getHospitalId()));

        BloodRequest bloodRequest = BloodRequest.builder()
                .hospital(hospital)
                .bloodGroup(request.getBloodGroup())
                .unitsRequired(request.getUnitsRequired())
                .description(request.getDescription())
                .expiresAt(request.getExpiresAt())
                .urgency(request.getUrgency())
                .createdAt(LocalDateTime.now())
                .status(BloodRequestStatus.OPEN)
                .build();

        BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);

        return BloodRequestResponse.builder()
                .hospitalId(savedRequest.getHospital().getId())
                .hospitalName(savedRequest.getHospital().getHospitalName())
                .bloodGroup(savedRequest.getBloodGroup())
                .unitsRequired(savedRequest.getUnitsRequired())
                .description(savedRequest.getDescription())
                .createdAt(savedRequest.getCreatedAt())
                .urgency(savedRequest.getUrgency())
                .expiresAt(savedRequest.getExpiresAt())
                .status(savedRequest.getStatus())
                .build();
    }


}
