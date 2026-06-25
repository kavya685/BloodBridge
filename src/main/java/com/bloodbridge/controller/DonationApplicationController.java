package com.bloodbridge.controller;

import com.bloodbridge.dto.donationApplication.DonationApplicationCreateRequest;
import com.bloodbridge.dto.donationApplication.DonationApplicationResponse;
import com.bloodbridge.service.DonationApplicationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/donation-applications")
public class DonationApplicationController {

    private final DonationApplicationService donationApplicationService;

    public DonationApplicationController(DonationApplicationService donationApplicationService)
    {
        this.donationApplicationService = donationApplicationService;
    }

    @PostMapping("/create")
    public DonationApplicationResponse createDonationApplication(@RequestBody DonationApplicationCreateRequest request)
    {
        return donationApplicationService.createDonationApplication(request);
    }

    @GetMapping("/{id}")
    public DonationApplicationResponse getDonationApplicationById(@PathVariable Long id)
    {
        return donationApplicationService.getDonationApplicationById(id);
    }

    @GetMapping("/all-donation-applications")
    public List<DonationApplicationResponse> getAllDonationApplications()
    {
        return donationApplicationService.getAllDonationApplications();
    }

    @GetMapping("/blood-requests/{bloodRequestId}")
    public List<DonationApplicationResponse> getApplicationsByBloodRequest(@PathVariable @RequestBody Long bloodRequestId)
    {
        return donationApplicationService.getApplicationsByBloodRequest(bloodRequestId);
    }

    @PutMapping("/accept-application/{applicationId}")
    public DonationApplicationResponse acceptApplication(@RequestBody @PathVariable Long applicationId)
    {
        return donationApplicationService.acceptApplication(applicationId);
    }

    @PutMapping("/reject-application/{applicationId}")
    public DonationApplicationResponse rejectApplication(@RequestBody @PathVariable Long applicationId)
    {
        return donationApplicationService.rejectApplication(applicationId);
    }
}
