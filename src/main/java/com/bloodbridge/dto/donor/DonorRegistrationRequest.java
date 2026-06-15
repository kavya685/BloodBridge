package com.bloodbridge.dto.donor;

import com.bloodbridge.enums.BloodGroup;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DonorRegistrationRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8,
            message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits"
    )
    private String contactNumber;

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotBlank(message = "City is required")
    private String city;

    @NotNull(message = "Availability status is required")
    private Boolean available;

    private LocalDate lastDonationDate;
}
