package com.bloodbridge.service.impl;

import com.bloodbridge.dto.donationApplication.DonationApplicationCreateRequest;
import com.bloodbridge.dto.donationApplication.DonationApplicationResponse;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.DonationApplication;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.enums.ApplicationStatus;
import com.bloodbridge.enums.BloodRequestStatus;
import com.bloodbridge.exception.InvalidBloodRequestException;
import com.bloodbridge.exception.ResourceAlreadyExistsException;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.DonationApplicationRepository;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.service.DonationApplicationService;
import org.springframework.security.core.context.SecurityContextHolder;
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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: " + email));

        BloodRequest bloodRequest = bloodRequestRepository.findById(request.getBloodRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: " + request.getBloodRequestId()));

        if(bloodRequest.getStatus() != BloodRequestStatus.OPEN)
        {
            throw new InvalidBloodRequestException("Cannot apply for a blood request that is not open");
        }

        // this condition is for when no body accepts the request and it expires,
        // so no one can apply for it anymore
        if (bloodRequest.getExpiresAt().isBefore(LocalDateTime.now()))
        {
            throw new InvalidBloodRequestException(
                    "This blood request has expired");
        }

        if(donationApplicationRepository.existsByDonorAndBloodRequest(
                        donor, bloodRequest))
        {
            throw new ResourceAlreadyExistsException(
                    "You have already applied for this blood request");
        }

        DonationApplication donationApplication = DonationApplication.builder()
                        .donor(donor)
                        .bloodRequest(bloodRequest)
                        .appliedAt(LocalDateTime.now())
                        .status(ApplicationStatus.PENDING)
                        .build();

        DonationApplication savedRequest = donationApplicationRepository.save(donationApplication);

        return DonationApplicationResponse.builder()
                .id(savedRequest.getId())
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

    @Override
    public DonationApplicationResponse rejectApplication(Long applicationId)
    {
        DonationApplication application = donationApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation application not found with id: " + applicationId));

        application.setStatus(ApplicationStatus.REJECTED);
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

    @Override
    public List<DonationApplicationResponse> getMyApplications()
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email:" + email));
        // orElseThrow() cannot be used here because findByDonorId()
        // returns a List, not an Optional. If no records are found,
        // Spring Data JPA returns an empty List.
        List<DonationApplication> applications = donationApplicationRepository.findByDonorId(donor.getId());

        if(applications.isEmpty())
        {
            throw new ResourceNotFoundException("No donation applications found for donor with id: " + donor.getId());
        }

        List<DonationApplicationResponse> responses = new ArrayList<>();
        for(DonationApplication application : applications)
        {
            responses.add(
                    DonationApplicationResponse.builder()
                            .id(application.getId())
                            .donorId(application.getDonor().getId())
                            .donorName(application.getDonor().getFullName())
                            .bloodRequestId(application.getBloodRequest().getId())
                            .status(application.getStatus())
                            .appliedAt(application.getAppliedAt())
                            .build()
            );
        }
        return responses;
    }
}
