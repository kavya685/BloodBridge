package com.bloodbridge.dto.admin;

import com.bloodbridge.enums.BloodGroup;
import com.bloodbridge.enums.BloodRequestStatus;
import com.bloodbridge.enums.UrgencyLevel;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminBloodRequestResponse {

    private Long id;

    private BloodGroup bloodGroup;

    private Integer unitsRequired;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    private UrgencyLevel urgency;

    private BloodRequestStatus status;

    private Long hospitalId;

    private String hospitalName;

    private String hospitalCity;
}