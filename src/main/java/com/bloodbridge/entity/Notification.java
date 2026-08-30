package com.bloodbridge.entity;

import com.bloodbridge.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Donor donor;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean isRead;

    private LocalDateTime createdAt;
}
