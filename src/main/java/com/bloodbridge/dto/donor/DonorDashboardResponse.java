package com.bloodbridge.dto.donor;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorDashboardResponse {
    private Long totalApplications;
    private Long pendingApplications;
    private Long acceptedApplications;
    private Long rejectedApplications;
}
