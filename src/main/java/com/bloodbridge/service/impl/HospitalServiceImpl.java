package com.bloodbridge.service.impl;

import com.bloodbridge.dto.hospital.HospitalLoginRequest;
import com.bloodbridge.dto.hospital.HospitalLoginResponse;
import com.bloodbridge.dto.hospital.HospitalRegistrationRequest;
import com.bloodbridge.dto.hospital.HospitalResponse;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.exception.InvalidCredentialsException;
import com.bloodbridge.exception.ResourceAlreadyExistsException;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.HospitalRepository;
import com.bloodbridge.security.JwtService;
import com.bloodbridge.service.HospitalService;
import io.jsonwebtoken.Jwt;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public HospitalServiceImpl(HospitalRepository hospitalRepository, PasswordEncoder passwordEncoder,
    JwtService jwtService) {
        this.hospitalRepository = hospitalRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

        Hospital hospital = Hospital.builder()
                .hospitalName(request.getHospitalName())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .city(request.getCity())
                .address(request.getAddress())
                .registrationNumber(request.getRegistrationNumber())
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

        if(!passwordEncoder.matches(request.getPassword(), hospital.getPassword()))
        {
            throw new InvalidCredentialsException("Invalid email or password");
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

}
