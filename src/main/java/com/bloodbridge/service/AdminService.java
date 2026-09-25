package com.bloodbridge.service;

import com.bloodbridge.dto.admin.*;

import java.util.List;

public interface AdminService {

    AdminLoginResponse loginAdmin(AdminLoginRequest request);
    AdminDashboardResponse getDashboard();

    List<AdminDonorResponse> getAllDonors();

    AdminDonorResponse getDonorById(Long donorId);

    List<AdminHospitalResponse> getAllHospitals();

    AdminHospitalResponse getHospitalById(Long hospitalId);

    List<AdminBloodRequestResponse> getAllBloodRequests();

    AdminBloodRequestResponse getBloodRequestById(
            Long requestId);

    void closeBloodRequest(
            Long requestId,
            AdminCloseRequest request);

    String acceptHospitalRegistration(Long hospitalId);

    String rejectHospitalRegistration(Long hospitalId);

    String suspendDonor(Long donorId);

    String reactivateDonor(Long donorId);

    String suspendHospital(Long hospitalId);

    String reactivateHospital(Long hospitalId);
}