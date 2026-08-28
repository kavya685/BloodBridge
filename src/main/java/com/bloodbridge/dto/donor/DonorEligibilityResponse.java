package com.bloodbridge.dto.donor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonorEligibilityResponse {
    private boolean eligible;
    private LocalDate nextEligible;
    private long daysRemaining;
}
