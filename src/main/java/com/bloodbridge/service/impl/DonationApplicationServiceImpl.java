package com.bloodbridge.service.impl;

import com.bloodbridge.dto.donationApplication.DonationApplicationCreateRequest;
import com.bloodbridge.dto.donationApplication.DonationApplicationResponse;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.DonationApplication;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.enums.ApplicationStatus;
import com.bloodbridge.enums.BloodRequestStatus;
import com.bloodbridge.enums.NotificationType;
import com.bloodbridge.exception.InvalidBloodRequestException;
import com.bloodbridge.exception.InvalidDonorException;
import com.bloodbridge.exception.ResourceAlreadyExistsException;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.DonationApplicationRepository;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.repository.HospitalRepository;
import com.bloodbridge.service.DonationApplicationService;

import com.bloodbridge.service.NotificationService;
import com.bloodbridge.util.AppConstants;
import com.bloodbridge.util.BloodCompatibility;
import jakarta.transaction.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DonationApplicationServiceImpl implements DonationApplicationService {

    private final DonationApplicationRepository donationApplicationRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final HospitalRepository hospitalRepository;
    private final NotificationService notificationService;

    public DonationApplicationServiceImpl (DonationApplicationRepository donationApplicationRepository,
                                           DonorRepository donorRepository,
                                           BloodRequestRepository bloodRequestRepository,
                                           HospitalRepository hospitalRepository,
                                           NotificationService notificationService)
    {
        this.donationApplicationRepository = donationApplicationRepository;
        this.donorRepository = donorRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.hospitalRepository = hospitalRepository;
        this.notificationService = notificationService;
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

        // Blood compatibility
        if (!BloodCompatibility.isCompatible(
                donor.getBloodGroup(),
                bloodRequest.getBloodGroup())) {

            throw new InvalidBloodRequestException(
                    "Your blood group is not compatible with this request");
        }

        // 90-day eligibility check
        if (donor.getLastDonationDate() != null) {
            LocalDate nextEligibleDate =
                    donor.getLastDonationDate().plusDays(AppConstants.DONATION_GAP_DAYS);

            if (LocalDate.now().isBefore(nextEligibleDate)) {
                long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), nextEligibleDate);
                throw new InvalidDonorException(
                        "You are not eligible to donate yet. Medical cooldown is active for " + daysRemaining + " more day(s) until " + nextEligibleDate);
            }
        }

        DonationApplication donationApplication = DonationApplication.builder()
                        .donor(donor)
                        .bloodRequest(bloodRequest)
                        .appliedAt(LocalDateTime.now())
                        .status(ApplicationStatus.PENDING)
                        .build();

        DonationApplication savedRequest = donationApplicationRepository.save(donationApplication);

        notificationService.createForHospital(
                bloodRequest.getHospital(),
                "A donor has applied to your blood request.",
                NotificationType.APPLICATION_RECEIVED
        );

        return mapToResponse(savedRequest);
    }

    private DonationApplicationResponse mapToResponse(DonationApplication application) {
        String hospitalName = null;
        String bloodGroup = null;
        Integer unitsRequired = null;

        if (application.getBloodRequest() != null) {
            if (application.getBloodRequest().getHospital() != null) {
                hospitalName = application.getBloodRequest().getHospital().getHospitalName();
            }
            if (application.getBloodRequest().getBloodGroup() != null) {
                bloodGroup = application.getBloodRequest().getBloodGroup().name();
            }
            unitsRequired = application.getBloodRequest().getUnitsRequired();
        }

        Donor donor = application.getDonor();
        boolean donorEligible = true;
        LocalDate nextEligibleDate = null;
        Long cooldownDaysRemaining = 0L;

        if (donor != null && donor.getLastDonationDate() != null) {
            nextEligibleDate = donor.getLastDonationDate().plusDays(AppConstants.DONATION_GAP_DAYS);
            if (LocalDate.now().isBefore(nextEligibleDate)) {
                donorEligible = false;
                cooldownDaysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), nextEligibleDate);
            }
        }

        return DonationApplicationResponse.builder()
                .id(application.getId())
                .donorId(donor != null ? donor.getId() : null)
                .donorName(donor != null ? donor.getFullName() : null)
                .bloodRequestId(application.getBloodRequest() != null ? application.getBloodRequest().getId() : null)
                .hospitalName(hospitalName)
                .bloodGroup(bloodGroup)
                .unitsRequired(unitsRequired)
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .remarks(application.getRemarks())
                .donorEligible(donorEligible)
                .nextEligibleDate(nextEligibleDate)
                .cooldownDaysRemaining(cooldownDaysRemaining)
                .build();
    }

    @Override
    public DonationApplicationResponse getDonationApplicationById(Long id)
    {
        DonationApplication donationApplication = donationApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation application not found with id: " + id));

        return mapToResponse(donationApplication);
    }

    @Override
    public List<DonationApplicationResponse> getApplicationsByBloodRequest(Long bloodRequestId) {
        BloodRequest bloodRequest = bloodRequestRepository.findById(bloodRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with id: " + bloodRequestId));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            Hospital hospital = hospitalRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));
            if (!bloodRequest.getHospital().getId().equals(hospital.getId())) {
                throw new InvalidBloodRequestException("You are not authorized to view applications for this blood request");
            }
        }

        List<DonationApplication> applications = donationApplicationRepository.findByBloodRequestId(bloodRequestId);
        List<DonationApplicationResponse> responses = new ArrayList<>();

        for (DonationApplication application : applications) {
            responses.add(mapToResponse(application));
        }
        return responses;
    }

    @Override
    public List<DonationApplicationResponse> getApplicationsByDonor(Long donorId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: " + email));

        List<DonationApplication> applications = donationApplicationRepository.findByDonorId(donor.getId());
        List<DonationApplicationResponse> responses = new ArrayList<>();

        for (DonationApplication application : applications) {
            responses.add(mapToResponse(application));
        }
        return responses;
    }

    @Override
    public DonationApplicationResponse acceptApplication(Long applicationId)
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));

        DonationApplication application = donationApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation application not found with id: " + applicationId));

        BloodRequest bloodRequest = application.getBloodRequest();
        if (!bloodRequest.getHospital().getId().equals(hospital.getId())) {
            throw new InvalidBloodRequestException("You are not authorized to manage this application");
        }

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new InvalidBloodRequestException("Only pending applications can be accepted");
        }
        
        if (bloodRequest.getUnitsRequired() <= 0) {
            throw new InvalidBloodRequestException("Blood request is already fulfilled");
        }

        Donor donor = application.getDonor();
        if (donor.getLastDonationDate() != null) {
            LocalDate nextEligibleDate = donor.getLastDonationDate().plusDays(AppConstants.DONATION_GAP_DAYS);
            if (LocalDate.now().isBefore(nextEligibleDate)) {
                long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), nextEligibleDate);
                throw new InvalidDonorException(
                        "Cannot accept application: Donor recently completed a blood donation and is currently in medical cooldown for " + daysRemaining + " more day(s) until " + nextEligibleDate);
            }
        }

        application.setStatus(ApplicationStatus.ACCEPTED);

        DonationApplication updatedApplication = donationApplicationRepository.save(application);

        notificationService.createForDonor(
                donor,
                "Your blood donation application has been accepted.",
                NotificationType.APPLICATION_ACCEPTED
        );

        return mapToResponse(updatedApplication);
    }

    @Override
    public DonationApplicationResponse rejectApplication(Long applicationId)
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));

        DonationApplication application = donationApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation application not found with id: " + applicationId));

        BloodRequest bloodRequest = application.getBloodRequest();
        if (!bloodRequest.getHospital().getId().equals(hospital.getId())) {
            throw new InvalidBloodRequestException("You are not authorized to manage this application");
        }

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new InvalidBloodRequestException("Only pending applications can be rejected");
        }

        application.setStatus(ApplicationStatus.REJECTED);
        DonationApplication updatedApplication = donationApplicationRepository.save(application);

        notificationService.createForDonor(
                application.getDonor(),
                "Your blood donation application has been rejected.",
                NotificationType.APPLICATION_REJECTED
        );

        return mapToResponse(updatedApplication);
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

        List<DonationApplicationResponse> responses = new ArrayList<>();
        for(DonationApplication application : applications)
        {
            responses.add(mapToResponse(application));
        }
        return responses;
    }

    @Override
    public void deleteDonationApplication(Long applicationId)
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Donor donor = donorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: " + email));

        DonationApplication application = donationApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation application not found with id: " + applicationId));

        if(!application.getDonor().getId().equals(donor.getId()))
        {
            throw new InvalidDonorException("You can only delete your own donation applications");
        }

        if(application.getStatus() != ApplicationStatus.PENDING)
        {
            throw new InvalidBloodRequestException("Only pending applications can be withdrawn");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        donationApplicationRepository.save(application);
    }

    @Override
    @Transactional
    public DonationApplicationResponse completeApplication(Long applicationId)
    {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital not found with email: " + email));

        DonationApplication application =
                donationApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Donation application not found with id: "
                                                + applicationId));

        if (application.getStatus() != ApplicationStatus.ACCEPTED) {
            throw new InvalidBloodRequestException(
                    "Only accepted applications can be completed");
        }

        BloodRequest bloodRequest = application.getBloodRequest();

        if (!bloodRequest.getHospital().getId().equals(hospital.getId())) {
            throw new InvalidBloodRequestException(
                    "You are not authorized to complete this application");
        }

        Donor donor = application.getDonor();

        // Check if donor is currently in medical cooldown
        if (donor.getLastDonationDate() != null) {
            LocalDate nextEligibleDate = donor.getLastDonationDate().plusDays(AppConstants.DONATION_GAP_DAYS);
            if (LocalDate.now().isBefore(nextEligibleDate)) {
                long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), nextEligibleDate);
                throw new InvalidDonorException(
                        "Cannot complete donation. Donor recently completed a blood donation and is currently in medical cooldown for " + daysRemaining + " more day(s) until " + nextEligibleDate);
            }
        }

        application.setStatus(ApplicationStatus.COMPLETED);

        donor.setLastDonationDate(LocalDate.now());
        donorRepository.save(donor);

        bloodRequest.setUnitsRequired(bloodRequest.getUnitsRequired() - 1);
        if(bloodRequest.getUnitsRequired() == 0)
        {
            bloodRequest.setStatus(BloodRequestStatus.FULFILLED);
            notificationService.createForHospital(
                    hospital,
                    "Blood request #" + bloodRequest.getId() + " has been completely fulfilled! All required units have been donated.",
                    NotificationType.BLOOD_REQUEST_FULFILLED
            );
        }
        bloodRequestRepository.save(bloodRequest);

        DonationApplication updatedApplication =
                donationApplicationRepository.save(application);

        // Auto-close / auto-reject all OTHER active applications (PENDING or ACCEPTED) of this donor
        List<DonationApplication> otherApplications = donationApplicationRepository.findByDonorId(donor.getId());
        long autoClosedCount = 0;
        for (DonationApplication otherApp : otherApplications) {
            if (!otherApp.getId().equals(application.getId()) &&
                    (otherApp.getStatus() == ApplicationStatus.PENDING || otherApp.getStatus() == ApplicationStatus.ACCEPTED)) {

                otherApp.setStatus(ApplicationStatus.REJECTED);
                otherApp.setRemarks("Auto-closed: Donor completed a blood donation elsewhere and has entered a " + AppConstants.DONATION_GAP_DAYS + "-day medical cooldown.");
                donationApplicationRepository.save(otherApp);
                autoClosedCount++;

                if (otherApp.getBloodRequest() != null && otherApp.getBloodRequest().getHospital() != null) {
                    notificationService.createForHospital(
                            otherApp.getBloodRequest().getHospital(),
                            "Application by " + donor.getFullName() + " for blood request #" + otherApp.getBloodRequest().getId() + " was auto-closed as donor completed donation elsewhere and entered medical cooldown.",
                            NotificationType.APPLICATION_REJECTED
                    );
                }
            }
        }

        String donorCompletionMsg = "Your blood donation has been completed.";
        if (autoClosedCount > 0) {
            donorCompletionMsg += " " + autoClosedCount + " other active application(s) were automatically closed because you have entered a " + AppConstants.DONATION_GAP_DAYS + "-day medical cooldown.";
        }

        notificationService.createForDonor(
                donor,
                donorCompletionMsg,
                NotificationType.DONATION_COMPLETED
        );

        return mapToResponse(updatedApplication);
    }
}
