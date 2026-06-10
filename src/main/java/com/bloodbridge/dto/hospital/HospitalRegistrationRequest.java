package com.bloodbridge.dto.hospital;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HospitalRegistrationRequest {

    private String hospitalName;

    private String contactNumber;

    private String email;

    private String password;

    private String city;

    private String address;

    private String registrationNumber;
}
