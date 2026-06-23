package com.bloodbridge.repository;

import com.bloodbridge.dto.donationApplication.DonationApplicationResponse;
import com.bloodbridge.entity.DonationApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationApplicationRepository extends JpaRepository<DonationApplication, Long> {
    List<DonationApplication> findByBloodRequestId(Long bloodRequestId);
}
