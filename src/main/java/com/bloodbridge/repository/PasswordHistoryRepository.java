package com.bloodbridge.repository;

import com.bloodbridge.entity.PasswordHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordHistoryRepository
        extends JpaRepository<PasswordHistory, Long> {

    List<PasswordHistory> findTop3ByDonorIdOrderByChangedAtDesc(Long donorId);

    List<PasswordHistory> findTop3ByHospitalIdOrderByChangedAtDesc(Long hospitalId);
}