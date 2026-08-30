package com.bloodbridge.controller;

import com.bloodbridge.dto.notification.NotificationResponse;
import com.bloodbridge.service.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService)
    {
        this.notificationService = notificationService;
    }

    @GetMapping("/donor")
    public List<NotificationResponse> getDonorNotifications()
    {
        return notificationService.getDonorNotifications();
    }

    @GetMapping("/hospital")
    public List<NotificationResponse> getHospitalNotifications()
    {
        return notificationService.getHospitalNotifications();
    }
}
