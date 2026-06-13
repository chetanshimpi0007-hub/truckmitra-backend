package com.truckmitra.service.fleet;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.*;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.PdfWriter;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class LRService {

    private final TripRepository tripRepository;
    private final com.truckmitra.service.notification.NotificationService notificationService;

    public void shareLR(Long tripId, String mobile) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        
        String message = "Hello! Here is the Digital LR for your trip from " + 
                         trip.getLoad().getSource() + " to " + trip.getLoad().getDestination() + 
                         ". LR Number: LR-" + trip.getId() + ". Track here: http://truckmitra.com/track/" + trip.getId();
        
        notificationService.sendNotification(0L, message, com.truckmitra.enums.ChannelType.WHATSAPP);
    }

    public byte[] generateLR(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, baos);

        document.open();

        // Styles
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Font.BOLD);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        // Header
        Paragraph title = new Paragraph("TRUCK MITRA - LORRY RECEIPT", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph("\n"));

        // Trip Info
        document.add(new Paragraph("LR Number: " + (trip.getTripNumber() != null ? trip.getTripNumber() : "LR-" + trip.getId()), headerFont));
        document.add(new Paragraph("Date: " + trip.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), normalFont));
        document.add(new Paragraph("Trip Status: " + trip.getStatus(), normalFont));
        document.add(new Paragraph("\n"));

        // From/To
        document.add(new Paragraph("FROM: " + trip.getSource(), normalFont));
        document.add(new Paragraph("TO: " + trip.getDestination(), normalFont));
        document.add(new Paragraph("\n"));

        // Material Details
        document.add(new Paragraph("MATERIAL DETAILS", headerFont));
        document.add(new Paragraph("Material: " + trip.getLoad().getMaterialType(), normalFont));
        document.add(new Paragraph("Weight: " + trip.getLoad().getWeight() + " Tons", normalFont));
        document.add(new Paragraph("\n"));

        // QR Code
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode("TRUCK-MITRA-" + trip.getTripNumber(), BarcodeFormat.QR_CODE, 150, 150);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            Image qrImage = Image.getInstance(pngOutputStream.toByteArray());
            qrImage.setAlignment(Element.ALIGN_RIGHT);
            document.add(qrImage);
        } catch (Exception e) {
            // Log error but continue
        }

        // Driver & Vehicle Details
        document.add(new Paragraph("FLEET DETAILS", headerFont));
        document.add(new Paragraph("Vehicle Number: " + (trip.getVehicle() != null ? trip.getVehicle().getVehicleNumber() : "N/A"), normalFont));
        document.add(new Paragraph("Driver Name: " + (trip.getDriver() != null ? trip.getDriver().getFullName() : "N/A"), normalFont));
        document.add(new Paragraph("\n"));

        // Terms
        document.add(new Paragraph("Disclaimer: This is a computer-generated LR and does not require a physical signature.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10)));

        document.close();
        return baos.toByteArray();
    }
}
