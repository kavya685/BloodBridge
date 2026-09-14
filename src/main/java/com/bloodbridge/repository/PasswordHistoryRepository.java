package com.bloodbridge.repository;

import com.bloodbridge.entity.PasswordHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PasswordHistoryRepository
        extends JpaRepository<PasswordHistory, Long> {

    List<PasswordHistory> findTop3ByDonorIdOrderByChangedAtDesc(Long donorId);

    List<PasswordHistory> findTop3ByHospitalIdOrderByChangedAtDesc(Long hospitalId);
}