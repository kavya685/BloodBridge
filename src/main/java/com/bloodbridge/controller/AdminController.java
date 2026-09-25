package com.bloodbridge.controller;

import com.bloodbridge.dto.admin.AdminLoginRequest;
import com.bloodbridge.dto.admin.AdminLoginResponse;
import com.bloodbridge.dto.admin.AdminDashboardResponse;
import com.bloodbridge.dto.admin.AdminDonorResponse;
import com.bloodbridge.dto.admin.AdminHospitalResponse;
import com.bloodbridge.dto.admin.AdminBloodRequestResponse;
import com.bloodbridge.dto.admin.AdminCloseRequest;

import com.bloodbridge.service.AdminService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ---------------- ADMIN LOGIN ----------------

    @PostMapping("/login")
    public AdminLoginResponse loginAdmin(
            @Valid @RequestBody AdminLoginRequest request) {

        return adminService.loginAdmin(request);
    }

    // ---------------- DASHBOARD ----------------

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {

        return adminService.getDashboard();
    }

    // ---------------- DONOR MANAGEMENT ----------------

    @GetMapping("/donors")
    public List<AdminDonorResponse> getAllDonors() {

        return adminService.getAllDonors();
    }

    @GetMapping("/donors/{donorId}")
    public AdminDonorResponse getDonorById(
            @PathVariable Long donorId) {

        return adminService.getDonorById(donorId);
    }

    // ---------------- HOSPITAL MANAGEMENT ----------------

    @GetMapping("/hospitals")
    public List<AdminHospitalResponse> getAllHospitals() {

        return adminService.getAllHospitals();
    }

    @GetMapping("/hospitals/{hospitalId}")
    public AdminHospitalResponse getHospitalById(
            @PathVariable Long hospitalId) {

        return adminService.getHospitalById(hospitalId);
    }

    // ---------------- BLOOD REQUEST MANAGEMENT ----------------

    @GetMapping("/blood-requests")
    public List<AdminBloodRequestResponse> getAllBloodRequests() {

        return adminService.getAllBloodRequests();
    }

    @GetMapping("/blood-requests/{requestId}")
    public AdminBloodRequestResponse getBloodRequestById(
            @PathVariable Long requestId) {

        return adminService.getBloodRequestById(requestId);
    }

    // ---------------- CLOSE BLOOD REQUEST ----------------

    @PutMapping("/blood-requests/{requestId}/close")
    public String closeBloodRequest(
            @PathVariable Long requestId,
            @RequestBody AdminCloseRequest request) {

        adminService.closeBloodRequest(requestId, request);

        return "Blood request closed successfully";
    }

    @PutMapping("/hospitals/{hospitalId}/accept")
    public String acceptHospitalRegistration(
            @PathVariable Long hospitalId) {

        return adminService.acceptHospitalRegistration(hospitalId);
    }

    @PutMapping("/hospitals/{hospitalId}/reject")
    public String rejectHospitalRegistration(
            @PathVariable Long hospitalId) {

        return adminService.rejectHospitalRegistration(hospitalId);
    }

    @PutMapping("/donors/{donorId}/suspend")
    public String suspendDonor(@PathVariable Long donorId) {
        return adminService.suspendDonor(donorId);
    }

    @PutMapping("/donors/{donorId}/reactivate")
    public String reactivateDonor(@PathVariable Long donorId) {
        return adminService.reactivateDonor(donorId);
    }

    @PutMapping("/hospitals/{hospitalId}/suspend")
    public String suspendHospital(@PathVariable Long hospitalId) {
        return adminService.suspendHospital(hospitalId);
    }

    @PutMapping("/hospitals/{hospitalId}/reactivate")
    public String reactivateHospital(@PathVariable Long hospitalId) {
        return adminService.reactivateHospital(hospitalId);
    }
}