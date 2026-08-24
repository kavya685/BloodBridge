package com.bloodbridge.repository;

import com.bloodbridge.dto.donationApplication.DonationApplicationResponse;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.DonationApplication;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationApplicationRepository extends JpaRepository<DonationApplication, Long> {
    List<DonationApplication> findByBloodRequestId(Long bloodRequestId);
    boolean existsByDonorAndBloodRequest(Donor donor, BloodRequest bloodRequest);
    List<DonationApplication> findByDonorId(Long donorId);
    boolean existsByBloodRequestId(Long bloodRequestId);
    Long countByBloodRequestHospitalId(Long hospitalId);
    Long countByBloodRequestHospitalIdAndStatus(Long hospitalId, ApplicationStatus status);
    Long countByDonorId(Long donorId);
    Long countByDonorIdAndStatus(Long donorId, ApplicationStatus status);
}
