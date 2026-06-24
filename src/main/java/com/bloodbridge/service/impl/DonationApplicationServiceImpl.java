package com.bloodbridge.service.impl;

import com.bloodbridge.dto.donationApplication.DonationApplicationCreateRequest;
import com.bloodbridge.dto.donationApplication.DonationApplicationResponse;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.DonationApplication;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.enums.ApplicationStatus;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.DonationApplicationRepository;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.service.DonationApplicationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DonationApplicationServiceImpl implements DonationApplicationService {

    private final DonationApplicationRepository donationApplicationRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public DonationApplicationServiceImpl (DonationApplicationRepository donationApplicationRepository,
                                           DonorRepository donorRepository,
                                           BloodRequestRepository bloodRequestRepository)
    {
        this.donationApplicationRepository = donationApplicationRepository;
        this.donorRepository = donorRepository;
        this.bloodRequestRepository = bloodRequestRepository;
    }

    @Override
    public DonationApplicationResponse createDonationApplication(DonationApplicationCreateRequest request)
    {
        Donor donor = donorRepository.findById(request.getDonorId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + request.getDonorId()));

        BloodRequest bloodRequest = bloodRequestRepository.findById(request.getBloodRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: " + request.getBloodRequestId()));

        DonationApplication donationApplication = DonationApplication.builder()
                        .donor(donor)
                        .bloodRequest(bloodRequest)
                        .appliedAt(LocalDateTime.now())
                        .status(ApplicationStatus.PENDING)
                        .build();

        DonationApplication savedRequest = donationApplicationRepository.save(donationApplication);

        return DonationApplicationResponse.builder()
                .bloodRequestId(savedRequest.getBloodRequest().getId())
                .donorId(savedRequest.getDonor().getId())
                .donorName(savedRequest.getDonor().getFullName())
                .status(savedRequest.getStatus())
                .appliedAt(savedRequest.getAppliedAt())
                .build();
    }

    @Override
    public DonationApplicationResponse getDonationApplicationById(Long id)
    {
        DonationApplication donationApplication = donationApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation application not found with id: " + id));

        return DonationApplicationResponse.builder()
                .id(donationApplication.getId())
                .bloodRequestId(donationApplication.getBloodRequest().getId())
                .donorId(donationApplication.getDonor().getId())
                .donorName(donationApplication.getDonor().getFullName())
                .status(donationApplication.getStatus())
                .appliedAt(donationApplication.getAppliedAt())
                .build();
    }

    @Override
    public List<DonationApplicationResponse> getAllDonationApplications()
    {
        List<DonationApplication> donationApplications = donationApplicationRepository.findAll();

        List<DonationApplicationResponse> responses = new ArrayList<>();

        for(DonationApplication donationApplication : donationApplications)
        {
            responses.add(DonationApplicationResponse.builder()
                    .donorId(donationApplication.getDonor().getId())
                    .donorName(donationApplication.getDonor().getFullName())
                    .bloodRequestId(donationApplication.getBloodRequest().getId())
                    .status(donationApplication.getStatus())
                    .appliedAt(donationApplication.getAppliedAt())
                    .id(donationApplication.getId())
                    .build());
        }
        return responses;
    }

    @Override
    public List<DonationApplicationResponse> getApplicationsByBloodRequest(Long bloodRequestId) {
        List<DonationApplication> applications = donationApplicationRepository.findByBloodRequestId(bloodRequestId);
        List<DonationApplicationResponse> responses = new ArrayList<>();

        for (DonationApplication application : applications) {
            responses.add(
                    DonationApplicationResponse.builder()
                            .id(application.getId())
                            .donorId(application.getDonor().getId())
                            .donorName(application.getDonor().getFullName())
                            .bloodRequestId(application.getBloodRequest().getId())
                            .status(application.getStatus())
                            .appliedAt(application.getAppliedAt())
                            .build());
        }
        return responses;
    }

    @Override
    public DonationApplicationResponse acceptApplication(Long applicationId)
    {
        DonationApplication application = donationApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation application not found with id: " + applicationId));

        application.setStatus(ApplicationStatus.ACCEPTED);
        DonationApplication updatedApplication = donationApplicationRepository.save(application);

        return DonationApplicationResponse.builder()
                .id(updatedApplication.getId())
                .donorId(updatedApplication.getDonor().getId())
                .donorName(updatedApplication.getDonor().getFullName())
                .bloodRequestId(updatedApplication.getBloodRequest().getId())
                .status(updatedApplication.getStatus())
                .appliedAt(updatedApplication.getAppliedAt())
                .build();
    }
}
