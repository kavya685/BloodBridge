package com.bloodbridge.service.impl;

import com.bloodbridge.dto.hospital.HospitalRegistrationRequest;
import com.bloodbridge.dto.hospital.HospitalResponse;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.exception.ResourceAlreadyExistsException;
import com.bloodbridge.repository.HospitalRepository;
import com.bloodbridge.service.HospitalService;
import org.springframework.stereotype.Service;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalServiceImpl(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
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
                .password(request.getPassword())
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
}
