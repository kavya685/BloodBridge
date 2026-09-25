package com.bloodbridge.dto.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLoginResponse {

    private Long id;
    private String fullName;
    private String email;
    private String token;
}