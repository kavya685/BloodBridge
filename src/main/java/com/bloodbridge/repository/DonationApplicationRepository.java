package com.bloodbridge.repository;

import com.bloodbridge.entity.DonationApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationApplicationRepository extends JpaRepository<DonationApplication, Long> {
}
