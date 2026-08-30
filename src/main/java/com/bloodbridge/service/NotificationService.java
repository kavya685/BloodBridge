package com.bloodbridge.service;

import com.bloodbridge.dto.notification.NotificationResponse;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    void createForDonor(Donor donor, String message, NotificationType type);
    void createForHospital(Hospital hospital, String message, NotificationType type);
    List<NotificationResponse> getDonorNotifications();
    List<NotificationResponse> getHospitalNotifications();
}
