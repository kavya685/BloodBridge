package com.bloodbridge.config;

import com.bloodbridge.entity.Admin;
import com.bloodbridge.repository.AdminRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String email = "admin@bloodbridge.com";

            if (!adminRepository.existsByEmail(email)) {

                Admin admin = Admin.builder()
                        .fullName("BloodBridge Admin")
                        .email(email)
                        .password(passwordEncoder.encode("Admin@12345"))
                        .active(true)
                        .build();

                adminRepository.save(admin);
            }
        };
    }
}