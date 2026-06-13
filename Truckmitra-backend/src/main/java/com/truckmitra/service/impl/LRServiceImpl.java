package com.truckmitra.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.lowagie.text.DocumentException;
import com.truckmitra.entity.load.LorryReceipt;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.LorryReceiptRepository;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.service.LRService;
import com.truckmitra.util.QRCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class LRServiceImpl implements LRService {

    @Autowired
    private LorryReceiptRepository lrRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private TemplateEngine templateEngine;

    @Override
    public LorryReceipt generateLR(Long tripId) throws Exception {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        // Check if LR already exists
        Optional<LorryReceipt> existing = lrRepository.findByTripId(tripId);
        if (existing.isPresent()) return existing.get();

        String lrNumber = "TM-LR-" + LocalDateTime.now().getYear() + "-" + tripId + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        
        // 1. Generate QR Code
        String verifyUrl = "https://truckmitra.com/verify/lr/" + lrNumber;
        byte[] qrImage = QRCodeGenerator.generateQRCodeImage(verifyUrl, 300, 300);
        
        String qrUrl;
        try {
            Map qrUpload = cloudinary.uploader().upload(qrImage, ObjectUtils.asMap("folder", "truckmitra/qrcodes", "public_id", lrNumber));
            qrUrl = (String) qrUpload.get("secure_url");
        } catch (Exception e) {
            qrUrl = "https://res.cloudinary.com/dummy/image/upload/v1234567890/mocked_qrcode_" + lrNumber + ".png";
        }

        // 2. Initial LR Entity
        LorryReceipt lr = LorryReceipt.builder()
                .lrNumber(lrNumber)
                .trip(trip)
                .qrCodeUrl(qrUrl)
                .generatedAt(LocalDateTime.now())
                .build();

        // 3. Generate PDF
        byte[] pdfBytes = generateLRPDF(lr);
        String pdfUrl;
        try {
            Map pdfUpload = cloudinary.uploader().upload(pdfBytes, ObjectUtils.asMap("folder", "truckmitra/lrs", "public_id", lrNumber, "resource_type", "auto"));
            pdfUrl = (String) pdfUpload.get("secure_url");
        } catch (Exception e) {
            pdfUrl = "/uploads/mocked_lr_" + lrNumber + ".pdf";
        }

        lr.setPdfUrl(pdfUrl);
        return lrRepository.save(lr);
    }

    @Override
    public Optional<LorryReceipt> getLRByNumber(String lrNumber) {
        return lrRepository.findByLrNumber(lrNumber);
    }

    @Override
    public Optional<LorryReceipt> getLRByTripId(Long tripId) {
        return lrRepository.findByTripId(tripId);
    }

    @Override
    public byte[] generateLRPDF(LorryReceipt lr) throws Exception {
        Trip trip = lr.getTrip();
        Context context = new Context();
        context.setVariable("lr", lr);
        context.setVariable("trip", trip);
        context.setVariable("load", trip.getLoad());
        context.setVariable("shipper", trip.getShipper());
        context.setVariable("transporter", trip.getTransporter());
        context.setVariable("driver", trip.getDriver());
        context.setVariable("vehicle", trip.getVehicle());

        String html = templateEngine.process("lr_template", context);

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(os);
            return os.toByteArray();
        }
    }
}
