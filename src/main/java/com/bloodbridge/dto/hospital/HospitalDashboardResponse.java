package com.bloodbridge.dto.hospital;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HospitalDashboardResponse {
    private long totalRequests;
    private long openRequests;
    private long fulfilledRequests;
    private long deletedRequests;

    private long totalApplications;
    private long pendingApplications;
    private long acceptedApplications;
    private long rejectedApplications;
}
