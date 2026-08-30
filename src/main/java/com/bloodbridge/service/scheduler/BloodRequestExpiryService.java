package com.bloodbridge.service.scheduler;

import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.enums.BloodRequestStatus;
import com.bloodbridge.repository.BloodRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BloodRequestExpiryService {
    private final BloodRequestRepository bloodRequestRepository;

    public BloodRequestExpiryService(BloodRequestRepository bloodRequestRepository) {
        this.bloodRequestRepository = bloodRequestRepository;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireBloodRequests()
    {
        List<BloodRequest> expiredRequests = bloodRequestRepository.findByStatusAndExpiresAtBefore(BloodRequestStatus.OPEN, LocalDateTime.now());

        for(BloodRequest bloodRequest : expiredRequests)
        {
            bloodRequest.setStatus(BloodRequestStatus.EXPIRED);
        }
        bloodRequestRepository.saveAll(expiredRequests);
    }
}
