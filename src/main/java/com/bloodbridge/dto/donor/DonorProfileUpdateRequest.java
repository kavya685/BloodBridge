package com.bloodbridge.dto.donor;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DonorProfileUpdateRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String contactNumber;

    @NotBlank
    private String city;

    private Boolean available;
}