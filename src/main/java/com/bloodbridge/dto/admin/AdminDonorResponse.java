package com.bloodbridge.dto.admin;

import com.bloodbridge.enums.BloodGroup;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDonorResponse {

    private Long id;
    private String fullName;
    private String email;
    private String contactNumber;
    private BloodGroup bloodGroup;
    private String city;
    private Boolean available;
    private LocalDate lastDonationDate;
}