package com.bloodbridge.dto.hospital;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HospitalLoginResponse {
    private String message;

    private Long id;

    private String hospitalName;

    private String contactNumber;

    private String email;

    private String city;

    private String address;

    private String registrationNumber;

    private String token;
}
