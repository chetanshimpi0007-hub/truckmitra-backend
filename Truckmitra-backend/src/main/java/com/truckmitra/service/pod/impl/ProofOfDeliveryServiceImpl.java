package com.truckmitra.service.pod.impl;

import com.truckmitra.exception.AppExceptions;
import org.springframework.stereotype.Service;

@Service
public class ProofOfDeliveryServiceImpl {

    public void uploadProof(Long tripId,
                            Long driverId,
                            String proofUrl) {

        throw new AppExceptions.ValidationException(
                "Proof Of Delivery module not implemented"
        );
    }
}