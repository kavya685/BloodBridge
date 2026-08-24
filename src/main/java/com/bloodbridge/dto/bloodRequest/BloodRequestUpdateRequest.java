package com.bloodbridge.dto.bloodRequest;

import com.bloodbridge.enums.UrgencyLevel;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BloodRequestUpdateRequest {

    @NotBlank
    private String description;

    @NotNull
    private UrgencyLevel urgency;

    @NotNull
    @Future
    private LocalDateTime expiresAt;
}
