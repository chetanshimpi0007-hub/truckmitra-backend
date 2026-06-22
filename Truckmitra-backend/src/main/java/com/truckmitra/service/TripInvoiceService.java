package com.truckmitra.service;

import com.truckmitra.dto.response.billing.TripInvoiceDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TripInvoiceService {
    Page<TripInvoiceDto> getAllInvoices(Pageable pageable);
    TripInvoiceDto getInvoiceById(Long id);
    TripInvoiceDto getInvoiceByTripId(Long tripId);
    byte[] generateInvoicePdf(Long id);
}
