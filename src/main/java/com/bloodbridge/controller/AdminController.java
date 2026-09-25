package com.bloodbridge.controller;

import com.bloodbridge.dto.admin.AdminLoginRequest;
import com.bloodbridge.dto.admin.AdminLoginResponse;
import com.bloodbridge.service.AdminService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public AdminLoginResponse loginAdmin(
            @Valid @RequestBody AdminLoginRequest request) {

        return adminService.loginAdmin(request);
    }
}