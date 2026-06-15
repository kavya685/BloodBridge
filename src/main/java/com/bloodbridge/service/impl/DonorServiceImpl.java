package com.bloodbridge.service.impl;

import com.bloodbridge.dto.donor.DonorLoginRequest;
import com.bloodbridge.dto.donor.DonorLoginResponse;
import com.bloodbridge.dto.donor.DonorRegistrationRequest;
import com.bloodbridge.dto.donor.DonorResponse;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.exception.InvalidCredentialsException;
import com.bloodbridge.exception.InvalidDonorException;
import com.bloodbridge.exception.ResourceAlreadyExistsException;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.service.DonorService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
public class DonorServiceImpl implements DonorService {

    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;

    public DonorServiceImpl(DonorRepository donorRepository, PasswordEncoder passwordEncoder)
    {
        this.donorRepository = donorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public DonorResponse registerDonor(DonorRegistrationRequest request)
    {
        if(donorRepository.existsByEmail(request.getEmail()))
        {
            throw new ResourceAlreadyExistsException("Email already registered");
        }

        if(donorRepository.existsByContactNumber(
                request.getContactNumber()))
        {
            throw new ResourceAlreadyExistsException(
                    "Phone number already registered");
        }

        if(request.getDateOfBirth().isAfter(LocalDate.now()))
        {
            throw new InvalidDonorException("Date of birth cannot be in the future");
        }

        if(request.getLastDonationDate() != null &&
                request.getLastDonationDate().isAfter(LocalDate.now()))
        {
            throw new InvalidDonorException(
                    "Last donation date cannot be in the future");
        }

        int age = Period.between(
                request.getDateOfBirth(),
                LocalDate.now()
        ).getYears();

        if(age < 18 || age > 65)
        {
            throw new InvalidDonorException("Donor age must be between 18 and 65 years");
        }

        Donor donor = Donor.builder()
                .fullName(request.getFullName())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .city(request.getCity())
                .bloodGroup(request.getBloodGroup())
                .dateOfBirth(request.getDateOfBirth())
                .available(request.getAvailable())
                .lastDonationDate(request.getLastDonationDate())
                .build();

        Donor savedDonor = donorRepository.save(donor);

        return DonorResponse.builder()
                .id(savedDonor.getId())
                .fullName(savedDonor.getFullName())
                .dateOfBirth(savedDonor.getDateOfBirth())
                .contactNumber(savedDonor.getContactNumber())
                .email(savedDonor.getEmail())
                .city(savedDonor.getCity())
                .bloodGroup(savedDonor.getBloodGroup())
                .available(savedDonor.getAvailable())
                .lastDonationDate(savedDonor.getLastDonationDate())
                .build();
    }

    @Override
    public DonorLoginResponse loginDonor(DonorLoginRequest request)
    {
        Donor donor = donorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if(!passwordEncoder.matches(request.getPassword(), donor.getPassword()))
        {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return DonorLoginResponse.builder()
                .message("Login successful!")
                .id(donor.getId())
                .fullName(donor.getFullName())
                .dateOfBirth(donor.getDateOfBirth())
                .contactNumber(donor.getContactNumber())
                .email(donor.getEmail())
                .city(donor.getCity())
                .bloodGroup(donor.getBloodGroup())
                .lastDonationDate(donor.getLastDonationDate())
                .build();
    }

    @Override
    public DonorResponse getDonorById(Long id)
    {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + id));

        return DonorResponse.builder()
                .id(donor.getId())
                .fullName(donor.getFullName())
                .dateOfBirth(donor.getDateOfBirth())
                .contactNumber(donor.getContactNumber())
                .email(donor.getEmail())
                .city(donor.getCity())
                .bloodGroup(donor.getBloodGroup())
                .available(donor.getAvailable())
                .lastDonationDate(donor.getLastDonationDate())
                .build();
    }
}
