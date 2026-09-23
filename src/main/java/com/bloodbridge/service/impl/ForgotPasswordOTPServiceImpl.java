package com.bloodbridge.service.impl;

import com.bloodbridge.dto.password.ResetPasswordRequest;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.entity.ForgotPasswordOTP;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.entity.PasswordHistory;
import com.bloodbridge.exception.InvalidCredentialsException;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.repository.ForgotPasswordOTPRepository;
import com.bloodbridge.repository.HospitalRepository;
import com.bloodbridge.repository.PasswordHistoryRepository;
import com.bloodbridge.service.ForgotPasswordOTPService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ForgotPasswordOTPServiceImpl implements ForgotPasswordOTPService {

    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final ForgotPasswordOTPRepository forgotPasswordOTPRepository;
    private final PasswordHistoryRepository passwordHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    public ForgotPasswordOTPServiceImpl(DonorRepository donorRepository, HospitalRepository hospitalRepository,
                                 ForgotPasswordOTPRepository forgotPasswordOTPRepository,
                                        PasswordHistoryRepository passwordHistoryRepository,
                                        PasswordEncoder passwordEncoder,
                                        JavaMailSender mailSender) {
        this.donorRepository = donorRepository;
        this.hospitalRepository = hospitalRepository;
        this.forgotPasswordOTPRepository = forgotPasswordOTPRepository;
        this.passwordHistoryRepository = passwordHistoryRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Override
    public String generateOTP()
    {
        return String.valueOf(100000 + new SecureRandom().nextInt(900000));
    }

    @Override
    public LocalDateTime sendOTP(String email)
    {
        boolean donor = donorRepository.findByEmail(email).isPresent();
        boolean hospital = hospitalRepository.findByEmail(email).isPresent();
        if(!donor && !hospital)
        {
            throw new ResourceNotFoundException("No account found with this email");
        }

        ForgotPasswordOTP forgotPasswordOTP = ForgotPasswordOTP.builder()
                .email(email)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .otp(generateOTP())
                .build();

        forgotPasswordOTPRepository.save(forgotPasswordOTP);

        // send to email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("BloodBridge - Password Reset OTP");
        message.setText(
                "Hello,\n\n" +
                        "Your BloodBridge password reset OTP is: " + forgotPasswordOTP.getOtp() + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not request a password reset, please ignore this email.\n\n" +
                        "Regards,\n" +
                        "BloodBridge Team"
        );
        mailSender.send(message);

        return forgotPasswordOTP.getExpiresAt();
    }

    @Override
    public void resetPassword(String email,
                              String password,
                              String confirmPassword)
    {
        if(!password.equals(confirmPassword))
        {
            throw new IllegalArgumentException("Passwords do not match");
        }

        Optional<Donor> donor = donorRepository.findByEmail(email);
        Optional<Hospital> hospital = hospitalRepository.findByEmail(email);

        if(donor.isPresent())
        {
            Donor d = donor.get();

            if(passwordEncoder.matches(
                    password,
                    d.getPassword()))
            {
                throw new InvalidCredentialsException(
                        "New password must be different from current password"
                );
            }

            List<PasswordHistory> history =
                    passwordHistoryRepository
                            .findTop3ByDonorIdOrderByChangedAtDesc(d.getId());

            for (PasswordHistory oldPassword : history) {

                if (passwordEncoder.matches(
                        password,
                        oldPassword.getPassword())) {

                    throw new InvalidCredentialsException(
                            "You cannot reuse one of your last 3 passwords"
                    );
                }
            }

            PasswordHistory oldPassword = PasswordHistory.builder()
                    .password(d.getPassword())
                    .changedAt(LocalDateTime.now())
                    .donor(d)
                    .build();

            passwordHistoryRepository.save(oldPassword);
            d.setPassword(passwordEncoder.encode(password));
            d.setPasswordExpiration(LocalDateTime.now().plusDays(30));
            donorRepository.save(d);
        }

        else {
            Hospital h = hospital.get();

            if(passwordEncoder.matches(
                    password,
                    h.getPassword()))
            {
                throw new InvalidCredentialsException(
                        "New password must be different from current password"
                );
            }

            List<PasswordHistory> history =
                    passwordHistoryRepository
                            .findTop3ByHospitalIdOrderByChangedAtDesc(h.getId());

            for (PasswordHistory oldPassword : history) {

                if (passwordEncoder.matches(
                        password,
                        oldPassword.getPassword())) {

                    throw new InvalidCredentialsException(
                            "You cannot reuse one of your last 3 passwords"
                    );
                }
            }

            PasswordHistory oldPassword = PasswordHistory.builder()
                    .password(h.getPassword())
                    .changedAt(LocalDateTime.now())
                    .hospital(h)
                    .build();

            passwordHistoryRepository.save(oldPassword);
            h.setPassword(passwordEncoder.encode(password));
            h.setPasswordExpiration(LocalDateTime.now().plusDays(30));
            hospitalRepository.save(h);
        }
    }

    @Override
    public boolean verifyOTP(String email, String otp)
    {
        ForgotPasswordOTP forgotPasswordOTP = forgotPasswordOTPRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid or expired OTP"));

        LocalDateTime now = LocalDateTime.now();

        if(forgotPasswordOTP.getExpiresAt().isBefore(now))
        {
            throw new InvalidCredentialsException(
                    "OTP has expired. Please request a new OTP.");
        }

        if(!forgotPasswordOTP.getOtp().equals(otp))
        {
            throw new InvalidCredentialsException("Invalid OTP");
        }

        forgotPasswordOTPRepository.delete(forgotPasswordOTP);
        return true;
    }
}
