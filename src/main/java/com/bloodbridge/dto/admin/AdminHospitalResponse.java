package com.bloodbridge.dto.admin;

import com.bloodbridge.enums.HospitalRegistrationStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminHospitalResponse {

    private Long id;
    private String hospitalName;
    private String email;
    private String contactNumber;
    private String city;
    private String address;
    private String registrationNumber;
    private HospitalRegistrationStatus registrationStatus;
}