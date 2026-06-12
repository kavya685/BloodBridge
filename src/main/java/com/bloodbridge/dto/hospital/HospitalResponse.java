package com.bloodbridge.dto.hospital;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalResponse {

    private Long id;

    private String hospitalName;

    private String contactNumber;

    private String email;

    private String city;

    private String address;

    private String registrationNumber;
}
