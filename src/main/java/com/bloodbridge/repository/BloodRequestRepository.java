package com.bloodbridge.repository;

import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.enums.BloodRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByHospitalId(Long hospitalId);
    List<BloodRequest> findByStatusNot(BloodRequestStatus status);
    long countByHospitalId(Long HospitalId);
    long countByHospitalIdAndStatus(Long HospitalId, BloodRequestStatus status);
    List<BloodRequest> findByStatusAndExpiresAtBefore(BloodRequestStatus status, LocalDateTime now);
}
