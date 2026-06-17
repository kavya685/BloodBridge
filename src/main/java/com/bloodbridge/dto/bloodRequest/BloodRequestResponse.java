package com.bloodbridge.dto.bloodRequest;

import com.bloodbridge.enums.BloodGroup;
import com.bloodbridge.enums.BloodRequestStatus;
import com.bloodbridge.enums.UrgencyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequestResponse {

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
}
