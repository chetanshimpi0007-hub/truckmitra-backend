package com.truckmitra.service.impl;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.truckmitra.dto.response.billing.TripInvoiceDto;
import com.truckmitra.entity.billing.TripInvoice;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.exception.ResourceNotFoundException;
import com.truckmitra.repository.billing.TripInvoiceRepository;
import com.truckmitra.service.TripInvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class TripInvoiceServiceImpl implements TripInvoiceService {

    private final TripInvoiceRepository invoiceRepository;

    @Override
    public Page<TripInvoiceDto> getAllInvoices(Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public TripInvoiceDto getInvoiceById(Long id) {
        return mapToDto(invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id)));
    }

    @Override
    public TripInvoiceDto getInvoiceByTripId(Long tripId) {
        return mapToDto(invoiceRepository.findByTripId(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for trip id: " + tripId)));
    }

    @Override
    public byte[] generateInvoicePdf(Long id) {
        TripInvoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Paragraph title = new Paragraph("TruckMitra Invoice", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);
            
            document.add(new Paragraph("Invoice Number: " + invoice.getInvoiceNumber()));
            document.add(new Paragraph("Date: " + invoice.getInvoiceDate()));
            document.add(new Paragraph("Due Date: " + invoice.getDueDate()));
            document.add(new Paragraph("Status: " + invoice.getStatus()));
            
            document.add(new Paragraph("\nTrip Information:"));
            Trip trip = invoice.getTrip();
            if (trip != null) {
                document.add(new Paragraph("Trip Number: " + trip.getTripNumber()));
            }

            document.add(new Paragraph("\nAmounts:"));
            document.add(new Paragraph("Amount: " + (invoice.getAmount() != null ? invoice.getAmount() : 0.0)));
            document.add(new Paragraph("GST Amount: " + (invoice.getGstAmount() != null ? invoice.getGstAmount() : 0.0)));
            document.add(new Paragraph("Total Amount: " + invoice.getTotalAmount()));
            document.add(new Paragraph("Paid Amount: " + invoice.getPaidAmount()));
            document.add(new Paragraph("Pending Amount: " + invoice.getPendingAmount()));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private TripInvoiceDto mapToDto(TripInvoice invoice) {
        return TripInvoiceDto.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .tripNumber(invoice.getTrip() != null ? invoice.getTrip().getTripNumber() : null)
                .amount(invoice.getAmount())
                .gstAmount(invoice.getGstAmount())
                .totalAmount(invoice.getTotalAmount())
                .paidAmount(invoice.getPaidAmount())
                .pendingAmount(invoice.getPendingAmount())
                .status(invoice.getStatus())
                .invoiceStatus(invoice.getInvoiceStatus())
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .pdfUrl(invoice.getPdfUrl())
                .createdAt(invoice.getCreatedAt())
                .build();
    }
}
