package com.truckmitra.service;

import com.truckmitra.dto.response.BidResponseDto;
import com.truckmitra.entity.load.Bid;
import com.truckmitra.entity.user.Transporter;

import java.math.BigDecimal;
import java.util.List;

public interface BidService {

    Bid placeBid(
            Long loadId,
            Transporter transporter,
            BigDecimal amount,
            Integer estimatedDays,
            String message,
            String vehicleType
    );

    List<Bid> getBidsForLoad(Long loadId);

    /**
     * Returns bids for a load as safe flat DTOs (no circular refs).
     * Transporter data is eagerly fetched via JOIN FETCH.
     * Results are sorted by amount ASC (lowest bid first).
     */
    List<BidResponseDto> getBidsForLoadAsDto(Long loadId);

    Bid acceptBid(Long bidId);

    Bid rejectBid(Long bidId);
}