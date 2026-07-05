package com.bloodbridge.dto.bloodRequest;

import com.bloodbridge.enums.BloodGroup;
import com.bloodbridge.enums.UrgencyLevel;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BloodRequestCreateRequest {

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Units required is mandatory")
    @Min(value = 1, message = "Units required must be at least 1")
    private Integer unitsRequired;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiresAt;

    @NotNull(message = "Urgency level is required")
    private UrgencyLevel urgency;
}
