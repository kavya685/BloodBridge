package com.bloodbridge.controller;

import com.bloodbridge.dto.bloodRequest.BloodRequestCreateRequest;
import com.bloodbridge.dto.bloodRequest.BloodRequestResponse;
import com.bloodbridge.service.BloodRequestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService)
    {
        this.bloodRequestService = bloodRequestService;
    }

    @PostMapping("/create")
    public BloodRequestResponse createBloodRequest(@RequestBody BloodRequestCreateRequest request)
    {
        return bloodRequestService.createBloodRequest(request);
    }

    @GetMapping("/{id}")
    public BloodRequestResponse getBloodRequestById(Long id)
    {
        return bloodRequestService.getBloodRequestById(id);
    }
}
