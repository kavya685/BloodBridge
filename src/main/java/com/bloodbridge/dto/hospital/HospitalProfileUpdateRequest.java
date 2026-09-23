package com.bloodbridge.dto.hospital;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HospitalProfileUpdateRequest {

    @NotBlank
    private String hospitalName;

    @NotBlank
    private String contactNumber;

    @NotBlank
    private String city;

    @NotBlank
    private String address;
}