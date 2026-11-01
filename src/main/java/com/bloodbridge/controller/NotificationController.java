package com.bloodbridge.controller;

import com.bloodbridge.dto.notification.NotificationResponse;
import com.bloodbridge.service.NotificationService;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id)
    {
        notificationService.markAsRead(id);
    }

    @PutMapping("/mark-all-read")
    public void markAllAsRead()
    {
        notificationService.markAllAsRead();
    }
}
