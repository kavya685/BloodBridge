package com.bloodbridge.repository;

import com.bloodbridge.entity.Hospital;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    boolean existsByEmail(String email);

    boolean existsByRegistrationNumber(String registrationNumber);
}
