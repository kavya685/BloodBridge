package com.bloodbridge.repository;

import com.bloodbridge.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    List<Notification> findByHospitalIdOrderByCreatedAtDesc(Long hospitalId);
}
