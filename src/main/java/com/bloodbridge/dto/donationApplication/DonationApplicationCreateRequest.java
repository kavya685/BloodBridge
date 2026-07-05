package com.bloodbridge.dto.donationApplication;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationApplicationCreateRequest {

    @NotNull(message = "Blood request id is required")
    private Long bloodRequestId;
}
