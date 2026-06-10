package com.bloodbridge.service.impl;

import com.bloodbridge.dto.hospital.HospitalRegistrationRequest;
import com.bloodbridge.dto.hospital.HospitalRegistrationResponse;
import com.bloodbridge.entity.Hospital;
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
    public HospitalRegistrationResponse registerHospital(HospitalRegistrationRequest request) {
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

        return HospitalRegistrationResponse.builder()
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
