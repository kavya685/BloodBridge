package com.bloodbridge.service.impl;

import com.bloodbridge.dto.bloodRequest.BloodRequestCreateRequest;
import com.bloodbridge.dto.bloodRequest.BloodRequestResponse;
import com.bloodbridge.dto.bloodRequest.BloodRequestUpdateRequest;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.enums.BloodRequestStatus;
import com.bloodbridge.exception.InvalidBloodRequestException;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.DonationApplicationRepository;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.repository.HospitalRepository;
import com.bloodbridge.service.BloodRequestService;
import com.bloodbridge.util.BloodCompatibility;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BloodRequestServiceImpl implements BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final HospitalRepository hospitalRepository;
    private final DonationApplicationRepository donationApplicationRepository;
    private final DonorRepository donorRepository;

    public BloodRequestServiceImpl(BloodRequestRepository bloodRequestRepository, DonorRepository donorRepository,
                                   HospitalRepository hospitalRepository, DonationApplicationRepository donationApplicationRepository)
    {
        this.bloodRequestRepository = bloodRequestRepository;
        this.hospitalRepository = hospitalRepository;
        this.donationApplicationRepository = donationApplicationRepository;
        this.donorRepository = donorRepository;
    }

    @Override
    public BloodRequestResponse createBloodRequest(BloodRequestCreateRequest request)
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));
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
                .id(savedRequest.getId())
                .build();
    }

    @Override
    public BloodRequestResponse getBloodRequestById(Long id)
    {
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: " + id));

        return BloodRequestResponse.builder()
                .id(request.getId())
                .hospitalId(request.getHospital().getId())
                .hospitalName(request.getHospital().getHospitalName())
                .bloodGroup(request.getBloodGroup())
                .unitsRequired(request.getUnitsRequired())
                .description(request.getDescription())
                .createdAt(request.getCreatedAt())
                .urgency(request.getUrgency())
                .expiresAt(request.getExpiresAt())
                .status(request.getStatus())
                .build();
    }

    @Override
    public List<BloodRequestResponse> getAllBloodRequests()
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: " + email));

        List<BloodRequest> bloodRequests = bloodRequestRepository.findByStatusNot(BloodRequestStatus.DELETED);

        List<BloodRequestResponse> responses = new ArrayList<>();

        for(BloodRequest bloodRequest : bloodRequests)
        {
            if(bloodRequest.getStatus() == BloodRequestStatus.OPEN)
            {
                if(BloodCompatibility.isCompatible(donor.getBloodGroup(), bloodRequest.getBloodGroup()))
                {
                    responses.add(BloodRequestResponse.builder()
                            .id(bloodRequest.getId())
                            .hospitalId(bloodRequest.getHospital().getId())
                            .hospitalName(bloodRequest.getHospital().getHospitalName())
                            .bloodGroup(bloodRequest.getBloodGroup())
                            .unitsRequired(bloodRequest.getUnitsRequired())
                            .description(bloodRequest.getDescription())
                            .createdAt(bloodRequest.getCreatedAt())
                            .urgency(bloodRequest.getUrgency())
                            .expiresAt(bloodRequest.getExpiresAt())
                            .status(bloodRequest.getStatus())
                            .build());
                }
            }
        }
        return responses;
    }

    @Override
    public List<BloodRequestResponse> getMyBloodRequests()
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));

        List<BloodRequest> bloodRequests = bloodRequestRepository.findByHospitalId(hospital.getId());

        if (bloodRequests.isEmpty())
        {
            throw new ResourceNotFoundException(
                    "No blood requests found for hospital with id: " + hospital.getId());
        }

        List<BloodRequestResponse> responses = new ArrayList<>();

        for (BloodRequest bloodRequest : bloodRequests)
        {
            responses.add(
                    BloodRequestResponse.builder()
                            .id(bloodRequest.getId())
                            .bloodGroup(bloodRequest.getBloodGroup())
                            .unitsRequired(bloodRequest.getUnitsRequired())
                            .description(bloodRequest.getDescription())
                            .createdAt(bloodRequest.getCreatedAt())
                            .expiresAt(bloodRequest.getExpiresAt())
                            .urgency(bloodRequest.getUrgency())
                            .status(bloodRequest.getStatus())
                            .hospitalId(bloodRequest.getHospital().getId())
                            .hospitalName(bloodRequest.getHospital().getHospitalName())
                            .build()
            );
        }

        return responses;
    }

    @Override
    public void deleteBloodRequest(Long id)
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        // finding hospital A
        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));

        // finding hospital B
        BloodRequest bloodRequest = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: " + id));

        // checking if A and B is same
        if(!bloodRequest.getHospital().getId().equals(hospital.getId()))
        {
            throw new InvalidBloodRequestException("You are not authorized to delete this blood request.");
        }

        if(donationApplicationRepository.existsByBloodRequestId(id))
        {
            bloodRequest.setStatus(BloodRequestStatus.DELETED);
            bloodRequestRepository.save(bloodRequest);
        }

        else
        {
            bloodRequestRepository.delete(bloodRequest);
        }
    }

    @Override
    public BloodRequestResponse updateBloodRequest(Long bloodRequestId, BloodRequestUpdateRequest request)
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));

        BloodRequest bloodRequest = bloodRequestRepository.findById(bloodRequestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Blood request not found with id: " + bloodRequestId));

        if (!bloodRequest.getHospital().getId().equals(hospital.getId())) {
            throw new RuntimeException(
                    "You are not authorized to edit this blood request");
        }

        if (bloodRequest.getStatus() != BloodRequestStatus.OPEN) {
            throw new RuntimeException(
                    "Only open blood requests can be edited");
        }

        bloodRequest.setDescription(request.getDescription());
        bloodRequest.setUrgency(request.getUrgency());
        bloodRequest.setExpiresAt(request.getExpiresAt());

        BloodRequest updatedRequest =
                bloodRequestRepository.save(bloodRequest);

        return BloodRequestResponse.builder()
                .id(updatedRequest.getId())
                .hospitalId(updatedRequest.getHospital().getId())
                .hospitalName(updatedRequest.getHospital().getHospitalName())
                .bloodGroup(updatedRequest.getBloodGroup())
                .unitsRequired(updatedRequest.getUnitsRequired())
                .description(updatedRequest.getDescription())
                .createdAt(updatedRequest.getCreatedAt())
                .urgency(updatedRequest.getUrgency())
                .expiresAt(updatedRequest.getExpiresAt())
                .status(updatedRequest.getStatus())
                .build();
    }
}
