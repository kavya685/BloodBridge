package com.bloodbridge.service.impl;

import com.bloodbridge.dto.hospital.*;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.entity.PasswordHistory;
import com.bloodbridge.enums.ApplicationStatus;
import com.bloodbridge.enums.BloodRequestStatus;
import com.bloodbridge.exception.InvalidCredentialsException;
import com.bloodbridge.exception.ResourceAlreadyExistsException;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.DonationApplicationRepository;
import com.bloodbridge.repository.HospitalRepository;
import com.bloodbridge.repository.PasswordHistoryRepository;
import com.bloodbridge.security.JwtService;
import com.bloodbridge.service.HospitalService;
import io.jsonwebtoken.Jwt;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonationApplicationRepository donationApplicationRepository;
    private final PasswordHistoryRepository passwordHistoryRepository;

    public HospitalServiceImpl(HospitalRepository hospitalRepository, BloodRequestRepository bloodRequestRepository,
                               DonationApplicationRepository donationApplicationRepository,
                               PasswordEncoder passwordEncoder,
                               JwtService jwtService, PasswordHistoryRepository passwordHistoryRepository) {
        this.hospitalRepository = hospitalRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.bloodRequestRepository = bloodRequestRepository;
        this.donationApplicationRepository = donationApplicationRepository;
        this.passwordHistoryRepository = passwordHistoryRepository;
    }

    @Override
    public HospitalResponse registerHospital(HospitalRegistrationRequest request) {
        if(hospitalRepository.existsByEmail(request.getEmail()))
        {
            throw new ResourceAlreadyExistsException("Email already registered");
        }

        if(hospitalRepository.existsByRegistrationNumber(request.getRegistrationNumber()))
        {
            throw new ResourceAlreadyExistsException("Registration number already registered");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        Hospital hospital = Hospital.builder()
                .hospitalName(request.getHospitalName())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .city(request.getCity())
                .address(request.getAddress())
                .registrationNumber(request.getRegistrationNumber())
                .passwordExpiration(LocalDateTime.now().plusDays(30))
                .build();
        Hospital savedHospital = hospitalRepository.save(hospital);

        return HospitalResponse.builder()
                .id(savedHospital.getId())
                .hospitalName(savedHospital.getHospitalName())
                .contactNumber(savedHospital.getContactNumber())
                .email(savedHospital.getEmail())
                .city(savedHospital.getCity())
                .address(savedHospital.getAddress())
                .registrationNumber(savedHospital.getRegistrationNumber())
                .build();
    }

    @Override
    public HospitalLoginResponse loginHospital(HospitalLoginRequest request)
    {
        Hospital hospital = hospitalRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        LocalDateTime now = LocalDateTime.now();

        if(hospital.getLockedUntil() != null && hospital.getLockedUntil().isAfter(now))
        {
            throw new InvalidCredentialsException(
                    "Account is temporarily locked. Please try again later.");
        }

        if(!passwordEncoder.matches(request.getPassword(), hospital.getPassword()))
        {
            hospital.setFailedLoginAttempts(hospital.getFailedLoginAttempts() + 1);
            if(hospital.getFailedLoginAttempts() >= 3)
            {
                hospital.setLockedUntil(
                        now.plusMinutes(15)
                );

                hospitalRepository.save(hospital);

                throw new InvalidCredentialsException(
                        "Account locked for 15 minutes due to multiple failed login attempts."
                );
            }

            hospitalRepository.save(hospital);

            throw new InvalidCredentialsException("Invalid email or password");
        }

        hospital.setFailedLoginAttempts(0);
        hospital.setLockedUntil(null);

        hospitalRepository.save(hospital);

        if(!hospital.getPasswordExpiration().isAfter(now))
        {
            throw new InvalidCredentialsException(
                    "Password has expired. Please change your password."
            );
        }

        String token = jwtService.generateToken(hospital.getEmail());

        return HospitalLoginResponse.builder()
                .message("Login successful!")
                .token(token)
                .hospitalName(hospital.getHospitalName())
                .id(hospital.getId())
                .contactNumber(hospital.getContactNumber())
                .email(hospital.getEmail())
                .city(hospital.getCity())
                .address(hospital.getAddress())
                .registrationNumber(hospital.getRegistrationNumber())
                .build();
    }

    @Override
    public HospitalResponse getHospitalById()
    {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));

        return HospitalResponse.builder()
                .id(hospital.getId())
                .hospitalName(hospital.getHospitalName())
                .contactNumber(hospital.getContactNumber())
                .email(hospital.getEmail())
                .city(hospital.getCity())
                .address(hospital.getAddress())
                .registrationNumber(hospital.getRegistrationNumber())
                .build();
    }

    @Override
    public HospitalDashboardResponse getDashboard()
    {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));

        Long hospitalId = hospital.getId();

        Long totalRequests = bloodRequestRepository.countByHospitalId(hospitalId);
        Long openRequests = bloodRequestRepository.countByHospitalIdAndStatus(hospitalId, BloodRequestStatus.OPEN);
        Long fulfilledRequests = bloodRequestRepository.countByHospitalIdAndStatus(hospitalId, BloodRequestStatus.FULFILLED);
        Long deletedRequests = bloodRequestRepository.countByHospitalIdAndStatus(hospitalId, BloodRequestStatus.DELETED);

        Long totalApplications = donationApplicationRepository.countByBloodRequestHospitalId(hospitalId);
        Long pendingApplications = donationApplicationRepository.countByBloodRequestHospitalIdAndStatus(hospitalId, ApplicationStatus.PENDING);
        Long acceptedApplications = donationApplicationRepository.countByBloodRequestHospitalIdAndStatus(hospitalId, ApplicationStatus.ACCEPTED);
        Long  rejectedApplications= donationApplicationRepository.countByBloodRequestHospitalIdAndStatus(hospitalId, ApplicationStatus.REJECTED);

        return HospitalDashboardResponse.builder()
                .totalRequests(totalRequests)
                .openRequests(openRequests)
                .fulfilledRequests(fulfilledRequests)
                .deletedRequests(deletedRequests)
                .totalApplications(totalApplications)
                .pendingApplications(pendingApplications)
                .acceptedApplications(acceptedApplications)
                .rejectedApplications(rejectedApplications)
                .build();
    }

    @Override
    public void changePassword(HospitalChangePasswordRequest request) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found"));

        LocalDateTime now = LocalDateTime.now();

        if(hospital.getLockedUntil() != null && hospital.getLockedUntil().isAfter(now))
        {
            throw new InvalidCredentialsException(
                    "Account is temporarily locked. Please try again later.");
        }

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                hospital.getPassword())) {

            hospital.setFailedLoginAttempts(hospital.getFailedLoginAttempts() + 1);
            if(hospital.getFailedLoginAttempts() >= 3)
            {
                hospital.setLockedUntil(
                        now.plusMinutes(15)
                );

                hospitalRepository.save(hospital);

                throw new InvalidCredentialsException(
                        "Account locked for 15 minutes due to multiple failed login attempts."
                );
            }

            hospitalRepository.save(hospital);

            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "Passwords do not match");
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                hospital.getPassword())) {

            throw new IllegalArgumentException(
                    "New password must be different from current password");
        }

        List<PasswordHistory> history =
                passwordHistoryRepository
                        .findTop3ByHospitalIdOrderByChangedAtDesc(
                                hospital.getId());

        for (PasswordHistory oldPassword : history) {

            if (passwordEncoder.matches(
                    request.getNewPassword(),
                    oldPassword.getPassword())) {

                throw new IllegalArgumentException(
                        "You cannot reuse one of your last 3 passwords");
            }
        }

        PasswordHistory oldPassword = PasswordHistory.builder()
                .password(hospital.getPassword())
                .changedAt(LocalDateTime.now())
                .hospital(hospital)
                .build();

        passwordHistoryRepository.save(oldPassword);

        hospital.setPassword(passwordEncoder.encode(request.getNewPassword()));
        hospital.setPasswordExpiration(LocalDateTime.now().plusDays(30));

        hospitalRepository.save(hospital);
    }

    @Override
    public void changePasswordRequest(HospitalChangePasswordRequest request)
    {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found"));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                hospital.getPassword())) {

            throw new InvalidCredentialsException(
                    "Current password is incorrect"
            );
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "Passwords do not match");
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                hospital.getPassword())) {

            throw new IllegalArgumentException(
                    "New password must be different from current password");
        }

        List<PasswordHistory> history =
                passwordHistoryRepository
                        .findTop3ByHospitalIdOrderByChangedAtDesc(
                                hospital.getId());

        for (PasswordHistory oldPassword : history) {

            if (passwordEncoder.matches(
                    request.getNewPassword(),
                    oldPassword.getPassword())) {

                throw new IllegalArgumentException(
                        "You cannot reuse one of your last 3 passwords");
            }
        }

        PasswordHistory oldPassword = PasswordHistory.builder()
                .password(hospital.getPassword())
                .changedAt(LocalDateTime.now())
                .hospital(hospital)
                .build();

        passwordHistoryRepository.save(oldPassword);
        hospital.setPassword(passwordEncoder.encode(request.getNewPassword()));
        hospital.setPasswordExpiration(LocalDateTime.now().plusDays(30));

        hospitalRepository.save(hospital);
    }

    @Override
    public HospitalResponse updateProfile(
            HospitalProfileUpdateRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital not found"));

        hospital.setHospitalName(request.getHospitalName());
        hospital.setContactNumber(request.getContactNumber());
        hospital.setCity(request.getCity());
        hospital.setAddress(request.getAddress());

        Hospital updatedHospital = hospitalRepository.save(hospital);

        return HospitalResponse.builder()
                .id(updatedHospital.getId())
                .hospitalName(updatedHospital.getHospitalName())
                .email(updatedHospital.getEmail())
                .contactNumber(updatedHospital.getContactNumber())
                .city(updatedHospital.getCity())
                .address(updatedHospital.getAddress())
                .registrationNumber(updatedHospital.getRegistrationNumber())
                .build();
    }
}
