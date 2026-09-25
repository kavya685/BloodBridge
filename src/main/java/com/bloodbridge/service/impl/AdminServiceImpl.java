package com.bloodbridge.service.impl;

import com.bloodbridge.dto.admin.AdminLoginRequest;
import com.bloodbridge.dto.admin.AdminLoginResponse;
import com.bloodbridge.dto.admin.AdminDashboardResponse;
import com.bloodbridge.dto.admin.AdminDonorResponse;
import com.bloodbridge.dto.admin.AdminHospitalResponse;
import com.bloodbridge.dto.admin.AdminBloodRequestResponse;
import com.bloodbridge.dto.admin.AdminCloseRequest;

import com.bloodbridge.entity.Admin;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.entity.BloodRequest;

import com.bloodbridge.enums.AccountStatus;
import com.bloodbridge.enums.BloodRequestStatus;

import com.bloodbridge.enums.HospitalRegistrationStatus;
import com.bloodbridge.exception.InvalidCredentialsException;
import com.bloodbridge.exception.ResourceNotFoundException;

import com.bloodbridge.repository.AdminRepository;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.repository.HospitalRepository;

import com.bloodbridge.security.JwtService;
import com.bloodbridge.service.AdminService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public AdminServiceImpl(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            DonorRepository donorRepository,
            HospitalRepository hospitalRepository,
            BloodRequestRepository bloodRequestRepository) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;

        this.donorRepository = donorRepository;
        this.hospitalRepository = hospitalRepository;
        this.bloodRequestRepository = bloodRequestRepository;
    }

    // ---------------- ADMIN LOGIN ----------------

    @Override
    public AdminLoginResponse loginAdmin(
            AdminLoginRequest request) {

        Admin admin = adminRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"
                        ));

        if (!Boolean.TRUE.equals(admin.getActive())) {

            throw new InvalidCredentialsException(
                    "Admin account is disabled"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword())) {

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(admin.getEmail());

        return AdminLoginResponse.builder()
                .id(admin.getId())
                .fullName(admin.getFullName())
                .email(admin.getEmail())
                .token(token)
                .build();
    }

    // ---------------- DASHBOARD ----------------

    @Override
    public AdminDashboardResponse getDashboard() {

        return AdminDashboardResponse.builder()

                .totalDonors(
                        donorRepository.count())

                .totalHospitals(
                        hospitalRepository.count())

                .totalBloodRequests(
                        bloodRequestRepository.count())

                .openRequests(
                        bloodRequestRepository
                                .countByStatus(
                                        BloodRequestStatus.OPEN))

                .fulfilledRequests(
                        bloodRequestRepository
                                .countByStatus(
                                        BloodRequestStatus.FULFILLED))

                .expiredRequests(
                        bloodRequestRepository
                                .countByStatus(
                                        BloodRequestStatus.EXPIRED))

                .deletedRequests(
                        bloodRequestRepository
                                .countByStatus(
                                        BloodRequestStatus.DELETED))

                .build();
    }

    // ---------------- DONOR MANAGEMENT ----------------

    @Override
    public List<AdminDonorResponse> getAllDonors() {

        return donorRepository.findAll()
                .stream()
                .map(this::mapDonor)
                .toList();
    }

    @Override
    public AdminDonorResponse getDonorById(
            Long donorId) {

        Donor donor = donorRepository
                .findById(donorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor not found with id: "
                                        + donorId
                        ));

        return mapDonor(donor);
    }

    private AdminDonorResponse mapDonor(
            Donor donor) {

        return AdminDonorResponse.builder()

                .id(donor.getId())

                .fullName(donor.getFullName())

                .email(donor.getEmail())

                .contactNumber(
                        donor.getContactNumber())

                .bloodGroup(
                        donor.getBloodGroup())

                .city(donor.getCity())

                .available(donor.getAvailable())

                .lastDonationDate(
                        donor.getLastDonationDate())

                .build();
    }

    // ---------------- HOSPITAL MANAGEMENT ----------------

    @Override
    public List<AdminHospitalResponse> getAllHospitals() {

        return hospitalRepository.findAll()
                .stream()
                .map(this::mapHospital)
                .toList();
    }

    @Override
    public AdminHospitalResponse getHospitalById(
            Long hospitalId) {

        Hospital hospital = hospitalRepository
                .findById(hospitalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital not found with id: "
                                        + hospitalId
                        ));

        return mapHospital(hospital);
    }

    private AdminHospitalResponse mapHospital(
            Hospital hospital) {

        return AdminHospitalResponse.builder()

                .id(hospital.getId())

                .hospitalName(
                        hospital.getHospitalName())

                .email(hospital.getEmail())

                .contactNumber(
                        hospital.getContactNumber())

                .city(hospital.getCity())

                .address(hospital.getAddress())

                .registrationNumber(
                        hospital.getRegistrationNumber())

                .registrationStatus(hospital.getRegistrationStatus())

                .build();
    }

    // ---------------- BLOOD REQUEST MANAGEMENT ----------------

    @Override
    public List<AdminBloodRequestResponse>
    getAllBloodRequests() {

        return bloodRequestRepository.findAll()
                .stream()
                .map(this::mapBloodRequest)
                .toList();
    }

    @Override
    public AdminBloodRequestResponse getBloodRequestById(
            Long requestId) {

        BloodRequest request =
                bloodRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Blood request not found "
                                                + "with id: "
                                                + requestId
                                ));

        return mapBloodRequest(request);
    }

    private AdminBloodRequestResponse mapBloodRequest(
            BloodRequest request) {

        Hospital hospital = request.getHospital();

        return AdminBloodRequestResponse.builder()

                .id(request.getId())

                .bloodGroup(
                        request.getBloodGroup())

                .unitsRequired(
                        request.getUnitsRequired())

                .description(
                        request.getDescription())

                .createdAt(
                        request.getCreatedAt())

                .expiresAt(
                        request.getExpiresAt())

                .urgency(
                        request.getUrgency())

                .status(
                        request.getStatus())

                .hospitalId(
                        hospital != null
                                ? hospital.getId()
                                : null)

                .hospitalName(
                        hospital != null
                                ? hospital.getHospitalName()
                                : null)

                .hospitalCity(
                        hospital != null
                                ? hospital.getCity()
                                : null)

                .build();
    }

    // ---------------- CLOSE BLOOD REQUEST ----------------

    @Override
    @Transactional
    public void closeBloodRequest(
            Long requestId,
            AdminCloseRequest request) {

        BloodRequest bloodRequest =
                bloodRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Blood request not found "
                                                + "with id: "
                                                + requestId
                                ));

        if (bloodRequest.getStatus()
                != BloodRequestStatus.OPEN) {

            throw new IllegalArgumentException(
                    "Only open blood requests can be closed"
            );
        }

        bloodRequest.setStatus(
                BloodRequestStatus.DELETED
        );

        bloodRequestRepository.save(bloodRequest);
    }

    @Override
    public String acceptHospitalRegistration(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital not found"
                        )
                );

        hospital.setRegistrationStatus(
                HospitalRegistrationStatus.ACCEPTED
        );

        hospitalRepository.save(hospital);

        return "Hospital registration accepted successfully";
    }

    @Override
    public String rejectHospitalRegistration(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital not found"
                        )
                );

        hospital.setRegistrationStatus(
                HospitalRegistrationStatus.REJECTED
        );

        hospitalRepository.save(hospital);

        return "Hospital registration rejected successfully";
    }

    @Override
    public String suspendDonor(Long donorId) {

        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor not found"
                        )
                );

        donor.setAccountStatus(AccountStatus.SUSPENDED);

        donorRepository.save(donor);

        return "Donor suspended successfully";
    }

    @Override
    public String reactivateDonor(Long donorId) {

        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor not found"
                        )
                );

        donor.setAccountStatus(AccountStatus.ACTIVE);

        donorRepository.save(donor);

        return "Donor reactivated successfully";
    }

    @Override
    public String suspendHospital(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital not found"
                        )
                );

        hospital.setAccountStatus(AccountStatus.SUSPENDED);

        hospitalRepository.save(hospital);

        return "Hospital suspended successfully";
    }

    @Override
    public String reactivateHospital(Long hospitalId) {

        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital not found"
                        )
                );

        hospital.setAccountStatus(AccountStatus.ACTIVE);

        hospitalRepository.save(hospital);

        return "Hospital reactivated successfully";
    }
}