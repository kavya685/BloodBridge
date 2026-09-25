package com.bloodbridge.dto.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    private long totalDonors;

    private long totalHospitals;

    private long totalBloodRequests;

    private long openRequests;

    private long fulfilledRequests;

    private long expiredRequests;

    private long deletedRequests;
}