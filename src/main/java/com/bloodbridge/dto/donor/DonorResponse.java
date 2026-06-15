package com.bloodbridge.dto.donor;

import com.bloodbridge.enums.BloodGroup;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DonorResponse {

    private Long id;

    private String fullName;

    private LocalDate dateOfBirth;

    private String email;

    private String contactNumber;

    private BloodGroup bloodGroup;

    private String city;

    private Boolean available;

    private LocalDate lastDonationDate;
}
