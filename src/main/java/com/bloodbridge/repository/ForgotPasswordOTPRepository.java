package com.bloodbridge.repository;

import com.bloodbridge.entity.ForgotPasswordOTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForgotPasswordOTPRepository extends JpaRepository<ForgotPasswordOTP, Long> {
    Optional<ForgotPasswordOTP> findByEmail(String email);
}
