package com.bloodbridge.service.impl;

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
    public Hospital registerHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }
}
