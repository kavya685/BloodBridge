package com.bloodbridge.service;

import com.bloodbridge.dto.admin.AdminLoginRequest;
import com.bloodbridge.dto.admin.AdminLoginResponse;

public interface AdminService {

    AdminLoginResponse loginAdmin(AdminLoginRequest request);
}