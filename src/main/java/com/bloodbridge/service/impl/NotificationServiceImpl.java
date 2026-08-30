package com.bloodbridge.service.impl;

import com.bloodbridge.dto.notification.NotificationResponse;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.entity.Notification;
import com.bloodbridge.enums.NotificationType;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.repository.HospitalRepository;
import com.bloodbridge.repository.NotificationRepository;
import com.bloodbridge.service.NotificationService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository, DonorRepository donorRepository, HospitalRepository hospitalRepository) {
        this.notificationRepository = notificationRepository;
        this.donorRepository = donorRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public void createForDonor(Donor donor, String message, NotificationType type)
    {
        Notification notification = Notification.builder()
                .donor(donor)
                .message(message)
                .type(type)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public void createForHospital(Hospital hospital, String message, NotificationType type)
    {
        Notification notification = Notification.builder()
                .hospital(hospital)
                .message(message)
                .type(type)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getDonorNotifications()
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Donor donor = donorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with email: " + email));


        List<Notification> notifications = notificationRepository.findByDonorIdOrderByCreatedAtDesc(donor.getId());
        List<NotificationResponse> response = new ArrayList<>();

        for(Notification notification : notifications)
        {
            response.add(
                    NotificationResponse.builder()
                            .id(notification.getId())
                            .message(notification.getMessage())
                            .type(notification.getType())
                            .isRead(notification.isRead())
                            .createdAt(notification.getCreatedAt())
                            .build()
            );
        }
        return response;
    }

    @Override
    public List<NotificationResponse> getHospitalNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with email: " + email));


        List<Notification> notifications = notificationRepository.findByHospitalIdOrderByCreatedAtDesc(hospital.getId());
        List<NotificationResponse> response = new ArrayList<>();

        for (Notification notification : notifications) {
            response.add(
                    NotificationResponse.builder()
                            .id(notification.getId())
                            .message(notification.getMessage())
                            .type(notification.getType())
                            .isRead(notification.isRead())
                            .createdAt(notification.getCreatedAt())
                            .build()
            );
        }
        return response;
    }
}
