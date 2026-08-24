package com.bloodbridge.controller;

import com.bloodbridge.dto.donationApplication.DonationApplicationCreateRequest;
import com.bloodbridge.dto.donationApplication.DonationApplicationResponse;
import com.bloodbridge.entity.DonationApplication;
import com.bloodbridge.service.DonationApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    @PostMapping
    public DonationApplicationResponse createDonationApplication(@Valid @RequestBody DonationApplicationCreateRequest request)
    {
        return donationApplicationService.createDonationApplication(request);
    }

    @GetMapping("/{id}")
    public DonationApplicationResponse getDonationApplicationById(@PathVariable Long id)
    {
        return donationApplicationService.getDonationApplicationById(id);
    }


    @GetMapping("/blood-requests/{bloodRequestId}")
    public List<DonationApplicationResponse> getApplicationsByBloodRequest(@PathVariable Long bloodRequestId)
    {
        return donationApplicationService.getApplicationsByBloodRequest(bloodRequestId);
    }

    @GetMapping("/applications/{donorId}")
    public List<DonationApplicationResponse> getApplicationsByDonor(@PathVariable Long donorId)
    {
        return donationApplicationService.getApplicationsByDonor(donorId);
    }

    @PutMapping("/{applicationId}/accept")
    public DonationApplicationResponse acceptApplication(@PathVariable Long applicationId)
    {
        return donationApplicationService.acceptApplication(applicationId);
    }

    @PutMapping("/{applicationId}/reject")
    public DonationApplicationResponse rejectApplication(@PathVariable Long applicationId)
    {
        return donationApplicationService.rejectApplication(applicationId);
    }

    @DeleteMapping("/{applicationId}")
    public void deleteDonationApplication(@PathVariable Long applicationId)
    {
        donationApplicationService.deleteDonationApplication(applicationId);
    }

    @PutMapping("/{applicationId}/completed")
    public DonationApplicationResponse completeApplication(@PathVariable Long applicationId)
    {
        return donationApplicationService.completeApplication(applicationId);
    }
}
