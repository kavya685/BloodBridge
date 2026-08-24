package com.bloodbridge.controller;

import com.bloodbridge.dto.bloodRequest.BloodRequestCreateRequest;
import com.bloodbridge.dto.bloodRequest.BloodRequestResponse;
import com.bloodbridge.dto.bloodRequest.BloodRequestUpdateRequest;
import com.bloodbridge.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService)
    {
        this.bloodRequestService = bloodRequestService;
    }

    @PostMapping
    public BloodRequestResponse createBloodRequest(@Valid @RequestBody BloodRequestCreateRequest request)
    {
        return bloodRequestService.createBloodRequest(request);
    }

    @GetMapping("/{id}")
    public BloodRequestResponse getBloodRequestById(@PathVariable Long id)
    {
        return bloodRequestService.getBloodRequestById(id);
    }

    @GetMapping
    public List<BloodRequestResponse> getAllBloodRequests()
    {
        return bloodRequestService.getAllBloodRequests();
    }

    @GetMapping("/my")
    public List<BloodRequestResponse> getMyBloodRequests()
    {
        return bloodRequestService.getMyBloodRequests();
    }

    @DeleteMapping("/{id}")
    public void deleteBloodRequest(@PathVariable Long id)
    {
        bloodRequestService.deleteBloodRequest(id);
    }

    @PutMapping("/{id}")
    public BloodRequestResponse updateBloodRequest(@PathVariable Long id, @Valid @RequestBody BloodRequestUpdateRequest request)
    {
        return bloodRequestService.updateBloodRequest(id,request);
    }
}
