package com.bloodbridge.dto.donationApplication;

import com.bloodbridge.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationApplicationResponse {

    private Long id;

    private Long donorId;

    private String donorName;

    private Long bloodRequestId;

    private ApplicationStatus status;

    private LocalDateTime appliedAt;

    private String hospitalName;

    private String bloodGroup;

    private Integer unitsRequired;

    private String remarks;

    private Boolean donorEligible;

    private LocalDate nextEligibleDate;

    private Long cooldownDaysRemaining;
}
