package com.bloodbridge.service.impl;

import com.bloodbridge.dto.admin.AdminLoginRequest;
import com.bloodbridge.dto.admin.AdminLoginResponse;
import com.bloodbridge.entity.Admin;
import com.bloodbridge.exception.InvalidCredentialsException;
import com.bloodbridge.repository.AdminRepository;
import com.bloodbridge.security.JwtService;
import com.bloodbridge.service.AdminService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminServiceImpl(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AdminLoginResponse loginAdmin(AdminLoginRequest request) {

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"
                        ));

        if (!Boolean.TRUE.equals(admin.getActive())) {
            throw new InvalidCredentialsException(
                    "Admin account is disabled"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword())) {

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(admin.getEmail());

        return AdminLoginResponse.builder()
                .id(admin.getId())
                .fullName(admin.getFullName())
                .email(admin.getEmail())
                .token(token)
                .build();
    }
}