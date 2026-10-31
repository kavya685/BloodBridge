package com.bloodbridge.config;

import com.bloodbridge.entity.Admin;
import com.bloodbridge.repository.AdminRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_EMAIL:admin@bloodbridge.com}") String email,
            @Value("${ADMIN_PASSWORD:Admin@12345}") String password) {

        return args -> {
            if (!adminRepository.existsByEmail(email)) {

                Admin admin = Admin.builder()
                        .fullName("BloodBridge Admin")
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .active(true)
                        .build();

                adminRepository.save(admin);
            }
        };
    }
}