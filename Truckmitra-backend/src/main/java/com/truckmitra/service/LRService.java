package com.truckmitra.service;

import com.truckmitra.entity.load.LorryReceipt;
import com.truckmitra.entity.load.Trip;
import java.util.Optional;

public interface LRService {
    LorryReceipt generateLR(Long tripId) throws Exception;
    Optional<LorryReceipt> getLRByNumber(String lrNumber);
    Optional<LorryReceipt> getLRByTripId(Long tripId);
    byte[] generateLRPDF(LorryReceipt lr) throws Exception;
}
