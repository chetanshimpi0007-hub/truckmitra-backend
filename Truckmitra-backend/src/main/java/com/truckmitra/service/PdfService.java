// src/main/java/com/truckmitra/service/PdfService.java
package com.truckmitra.service;

import com.truckmitra.dto.RouteData;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.entity.user.Driver;
import com.truckmitra.entity.user.Shipper;
import com.truckmitra.entity.user.Transporter;
import com.truckmitra.entity.user.User;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPCell;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");
    private static final Color BRAND_BLUE   = new Color(30, 58, 138);
    private static final Color BRAND_GREEN  = new Color(5, 150, 105);
    private static final Color BRAND_ORANGE = new Color(234, 88, 12);
    private static final Color LIGHT_GRAY   = new Color(243, 244, 246);

    // ── TRIP ASSIGNMENT PDF (generated when driver ACCEPTS) ───────────────────

    public byte[] generateAssignmentPdf(Trip trip, RouteData routeData) throws IOException {
        Document document = new Document(PageSize.A4, 40, 40, 50, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Header
            addBrandedHeader(document, "TRIP ASSIGNMENT CONFIRMATION");

            // Trip Reference
            Font refFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, BRAND_BLUE);
            document.add(new Paragraph("Trip #" + trip.getTripNumber(), refFont));
            document.add(new Paragraph(" "));

            // Route Section
            addSectionHeader(document, "📍 Route Details");
            PdfPTable routeTable = createTable(2);
            addTableRow(routeTable, "Pickup Address", trip.getSource());
            addTableRow(routeTable, "Delivery Address", trip.getDestination());
            document.add(routeTable);
            document.add(new Paragraph(" "));

            // Route Intelligence
            addSectionHeader(document, "🗺️ Route Intelligence (OSRM)");
            PdfPTable routeIntelTable = createTable(2);
            addTableRow(routeIntelTable, "Total Distance",
                    routeData != null && routeData.getDistanceKm() != null
                            ? String.format("%.2f km", routeData.getDistanceKm())
                            : (trip.getDistance() != null ? String.format("%.2f km", trip.getDistance()) : "N/A"));
            addTableRow(routeIntelTable, "Estimated Travel Time",
                    formatEta(routeData != null ? routeData.getEstimatedTravelTimeMins()
                            : trip.getEstimatedTravelTimeMins()));
            addTableRow(routeIntelTable, "Toll Plazas",
                    routeData != null && routeData.getTollPlazaCount() != null
                            ? String.valueOf(routeData.getTollPlazaCount())
                            : (trip.getTollPlazaCount() != null ? String.valueOf(trip.getTollPlazaCount()) : "N/A"));
            addTableRow(routeIntelTable, "Estimated Toll Cost",
                    routeData != null && routeData.getEstimatedTollCostInr() != null
                            ? String.format("₹%.2f", routeData.getEstimatedTollCostInr())
                            : "N/A");
            addTableRow(routeIntelTable, "Fuel Estimate",
                    routeData != null && routeData.getFuelEstimateLiters() != null
                            ? String.format("%.2f L", routeData.getFuelEstimateLiters())
                            : "N/A");
            addTableRow(routeIntelTable, "CO₂ Emission",
                    routeData != null && routeData.getCarbonEmissionKg() != null
                            ? String.format("%.2f kg", routeData.getCarbonEmissionKg())
                            : "N/A");
            document.add(routeIntelTable);
            document.add(new Paragraph(" "));

            // Driver Details
            addSectionHeader(document, "👤 Driver Details");
            PdfPTable driverTable = createTable(2);
            if (trip.getDriver() != null) {
                Driver d = trip.getDriver();
                addTableRow(driverTable, "Driver Name", safe(d.getFullName()));
                addTableRow(driverTable, "Mobile", safe(d.getMobile()));
                addTableRow(driverTable, "License Number", safe(d.getDrivingLicenseNumber()));
            } else {
                addTableRow(driverTable, "Driver", "Pending Assignment");
            }
            document.add(driverTable);
            document.add(new Paragraph(" "));

            // Vehicle Details
            addSectionHeader(document, "🚛 Vehicle Details");
            PdfPTable vehicleTable = createTable(2);
            if (trip.getVehicle() != null) {
                addTableRow(vehicleTable, "Vehicle Number", safe(trip.getVehicle().getVehicleNumber()));
                addTableRow(vehicleTable, "Vehicle Type", safe(String.valueOf(trip.getVehicle().getVehicleType())));
            } else {
                addTableRow(vehicleTable, "Vehicle", "Pending Assignment");
            }
            document.add(vehicleTable);
            document.add(new Paragraph(" "));

            // Financial Details
            addSectionHeader(document, "💰 Financial Summary");
            PdfPTable finTable = createTable(2);
            addTableRow(finTable, "Freight Amount",
                    trip.getFreightAmount() != null ? String.format("₹%.2f", trip.getFreightAmount()) : "N/A");
            document.add(finTable);
            document.add(new Paragraph(" "));

            // Footer
            addFooter(document);

            document.close();
        } catch (DocumentException e) {
            throw new IOException("Error generating Assignment PDF", e);
        }

        return out.toByteArray();
    }

    // ── FINAL INVOICE PDF (generated when trip COMPLETED) ────────────────────

    public byte[] generateFinalInvoicePdf(Trip trip) throws IOException {
        Document document = new Document(PageSize.A4, 40, 40, 50, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Header
            addBrandedHeader(document, "FINAL TRIP INVOICE");

            // Reference
            Font refFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, BRAND_BLUE);
            document.add(new Paragraph("Trip #" + trip.getTripNumber(), refFont));
            if (trip.getCompletedAt() != null) {
                document.add(new Paragraph("Completed At: " + trip.getCompletedAt().format(DATE_FMT),
                        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BRAND_GREEN)));
            }
            document.add(new Paragraph(" "));

            // Route
            addSectionHeader(document, "📍 Route");
            PdfPTable routeTable = createTable(2);
            addTableRow(routeTable, "Source", safe(trip.getSource()));
            addTableRow(routeTable, "Destination", safe(trip.getDestination()));
            addTableRow(routeTable, "Distance", trip.getDistance() != null ? String.format("%.2f km", trip.getDistance()) : "N/A");
            addTableRow(routeTable, "Est. Travel Time", formatEta(trip.getEstimatedTravelTimeMins()));
            document.add(routeTable);
            document.add(new Paragraph(" "));

            // Costs & Route Intelligence
            addSectionHeader(document, "💡 Route Intelligence Summary");
            PdfPTable costTable = createTable(2);
            addTableRow(costTable, "Toll Plazas", trip.getTollPlazaCount() != null ? String.valueOf(trip.getTollPlazaCount()) : "N/A");
            addTableRow(costTable, "Est. Toll Charges", trip.getEstimatedTollCost() != null ? String.format("₹%.2f", trip.getEstimatedTollCost()) : "N/A");
            addTableRow(costTable, "Fuel Estimate", trip.getFuelEstimateLiters() != null ? String.format("%.2f L", trip.getFuelEstimateLiters()) : "N/A");
            addTableRow(costTable, "Carbon Emission (CO₂)", trip.getCarbonEmission() != null ? String.format("%.2f kg", trip.getCarbonEmission()) : "N/A");
            document.add(costTable);
            document.add(new Paragraph(" "));

            // Financial Summary
            addSectionHeader(document, "💰 Financial Summary");
            PdfPTable finTable = createTable(2);
            addTableRow(finTable, "Freight Amount", trip.getFreightAmount() != null ? String.format("₹%.2f", trip.getFreightAmount()) : "N/A");
            addTableRow(finTable, "Total Toll Cost", trip.getTotalTollCost() != null ? String.format("₹%.2f", trip.getTotalTollCost()) : "N/A");
            addTableRow(finTable, "Fuel Cost", trip.getFuelCost() != null ? String.format("₹%.2f", trip.getFuelCost()) : "N/A");
            document.add(finTable);
            document.add(new Paragraph(" "));

            // Driver & Vehicle
            addSectionHeader(document, "👤 Driver & Vehicle");
            PdfPTable dvTable = createTable(2);
            if (trip.getDriver() != null) {
                addTableRow(dvTable, "Driver Name", safe(trip.getDriver().getFullName()));
                addTableRow(dvTable, "Driver Mobile", safe(trip.getDriver().getMobile()));
            }
            if (trip.getVehicle() != null) {
                addTableRow(dvTable, "Vehicle Number", safe(trip.getVehicle().getVehicleNumber()));
                addTableRow(dvTable, "Vehicle Type", safe(String.valueOf(trip.getVehicle().getVehicleType())));
            }
            document.add(dvTable);
            document.add(new Paragraph(" "));

            // Document References
            addSectionHeader(document, "📄 Document References");
            PdfPTable docTable = createTable(2);
            addTableRow(docTable, "Pickup Receipt", trip.getPickupReceiptUrl() != null ? "Uploaded ✓" : "N/A");
            addTableRow(docTable, "Delivery Receipt", trip.getDeliveryReceiptUrl() != null ? "Uploaded ✓" : "N/A");
            addTableRow(docTable, "POD Reference", safe(trip.getPodReferenceNumber()));
            addTableRow(docTable, "POD Document", trip.getPodUrl() != null ? "Uploaded ✓" : "N/A");
            document.add(docTable);
            document.add(new Paragraph(" "));

            addFooter(document);

            document.close();
        } catch (DocumentException e) {
            throw new IOException("Error generating Final Invoice PDF", e);
        }

        return out.toByteArray();
    }

    // ── TRIP DETAILS PDF (original, kept for backward compatibility) ──────────

    public byte[] generateTripPdf(Trip trip) throws IOException {
        Document document = new Document(PageSize.A4, 40, 40, 50, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            addBrandedHeader(document, "TRIP DETAILS");

            Font refFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, BRAND_BLUE);
            document.add(new Paragraph("Trip #" + (trip.getTripNumber() != null ? trip.getTripNumber() : trip.getId()), refFont));
            document.add(new Paragraph(" "));

            if (trip.getLoad() != null) {
                addSectionHeader(document, "📍 Route");
                PdfPTable t = createTable(2);
                addTableRow(t, "From", safe(trip.getLoad().getSource()));
                addTableRow(t, "To", safe(trip.getLoad().getDestination()));
                if (trip.getLoad().getMaterialType() != null)
                    addTableRow(t, "Material", trip.getLoad().getMaterialType());
                if (trip.getLoad().getWeight() != null)
                    addTableRow(t, "Weight", trip.getLoad().getWeight() + " Tons");
                document.add(t);
                document.add(new Paragraph(" "));
            }

            addSectionHeader(document, "📊 Route Intelligence");
            PdfPTable riTable = createTable(2);
            addTableRow(riTable, "Distance", trip.getDistance() != null ? String.format("%.2f km", trip.getDistance()) : "N/A");
            addTableRow(riTable, "Est. Travel Time", formatEta(trip.getEstimatedTravelTimeMins()));
            addTableRow(riTable, "Toll Plazas", trip.getTollPlazaCount() != null ? String.valueOf(trip.getTollPlazaCount()) : "N/A");
            addTableRow(riTable, "Est. Toll Cost", trip.getEstimatedTollCost() != null ? String.format("₹%.2f", trip.getEstimatedTollCost()) : "N/A");
            addTableRow(riTable, "Fuel Estimate", trip.getFuelEstimateLiters() != null ? String.format("%.2f L", trip.getFuelEstimateLiters()) : "N/A");
            addTableRow(riTable, "Carbon Emission", trip.getCarbonEmission() != null ? String.format("%.2f kg", trip.getCarbonEmission()) : "N/A");
            addTableRow(riTable, "Freight Amount", trip.getFreightAmount() != null ? String.format("₹%.2f", trip.getFreightAmount()) : "N/A");
            document.add(riTable);
            document.add(new Paragraph(" "));

            addSectionHeader(document, "👤 Driver");
            PdfPTable dTable = createTable(2);
            if (trip.getDriver() != null) {
                addTableRow(dTable, "Name", safe(trip.getDriver().getFullName()));
                addTableRow(dTable, "Mobile", safe(trip.getDriver().getMobile()));
            } else {
                addTableRow(dTable, "Driver", "Pending Assignment");
            }
            document.add(dTable);
            document.add(new Paragraph(" "));

            addSectionHeader(document, "🚛 Vehicle");
            PdfPTable vTable = createTable(2);
            if (trip.getVehicle() != null) {
                addTableRow(vTable, "Number", safe(trip.getVehicle().getVehicleNumber()));
                addTableRow(vTable, "Type", safe(String.valueOf(trip.getVehicle().getVehicleType())));
            } else {
                addTableRow(vTable, "Vehicle", "Pending Assignment");
            }
            document.add(vTable);
            document.add(new Paragraph(" "));

            if (trip.getCompletedAt() != null || trip.getPodReferenceNumber() != null) {
                addSectionHeader(document, "✅ Completion");
                PdfPTable compTable = createTable(2);
                if (trip.getCompletedAt() != null)
                    addTableRow(compTable, "Completed At", trip.getCompletedAt().format(DATE_FMT));
                if (trip.getPodReferenceNumber() != null)
                    addTableRow(compTable, "POD Ref", trip.getPodReferenceNumber());
                document.add(compTable);
                document.add(new Paragraph(" "));
            }

            addFooter(document);
            document.close();
        } catch (DocumentException e) {
            throw new IOException("Error generating PDF", e);
        }

        return out.toByteArray();
    }

    // ── USER REGISTRATION PDF ─────────────────────────────────────────────────

    public byte[] generateUserRegistrationPdf(User user) throws IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Paragraph title = new Paragraph("User Registration Dossier", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("Role: " + user.getRole(),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            document.add(new Paragraph("Generated on: " + java.time.LocalDateTime.now()));
            document.add(new Paragraph("----------------------------------------------------------"));
            document.add(new Paragraph(" "));

            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            document.add(new Paragraph("1. Personal Information", sectionFont));
            document.add(new Paragraph("Full Name: " + user.getFullName()));
            document.add(new Paragraph("Email: " + user.getEmail()));
            document.add(new Paragraph("Mobile: " + user.getMobile()));
            document.add(new Paragraph("Address: " + user.getAddress() + ", " + user.getArea() + ", " + user.getLandmark()));
            document.add(new Paragraph("City/State/Zip: " + user.getCity() + ", " + user.getState() + " - " + user.getPincode()));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("2. Role Specific Details", sectionFont));
            if (user instanceof Driver driver) {
                document.add(new Paragraph("License Number: " + driver.getDrivingLicenseNumber()));
                document.add(new Paragraph("License Expiry: " + driver.getLicenseExpiryDate()));
                document.add(new Paragraph("Aadhaar Number: " + driver.getAadhaarNumber()));
                document.add(new Paragraph("PAN Number: " + driver.getPanNumber()));
                document.add(new Paragraph("Vehicle Number: " + driver.getVehicleNumber()));
                document.add(new Paragraph("Vehicle Capacity: " + driver.getVehicleCapacity()));
                document.add(new Paragraph("Fuel Type: " + driver.getVehicleFuelType()));
            } else if (user instanceof Shipper shipper) {
                document.add(new Paragraph("Company Name: " + shipper.getCompanyName()));
                document.add(new Paragraph("GST Number: " + shipper.getGstNumber()));
                document.add(new Paragraph("PAN Number: " + shipper.getPanNumber()));
                document.add(new Paragraph("Aadhaar Number: " + shipper.getAadhaarNumber()));
                document.add(new Paragraph("Business Type: " + shipper.getBusinessType()));
            } else if (user instanceof Transporter transporter) {
                document.add(new Paragraph("Agency Name: " + transporter.getAgencyName()));
                document.add(new Paragraph("GST Number: " + transporter.getGstNumber()));
                document.add(new Paragraph("PAN Number: " + transporter.getPanNumber()));
                document.add(new Paragraph("Aadhaar Number: " + transporter.getAadhaarNumber()));
                document.add(new Paragraph("Fleet Size: " + transporter.getFleetSize()));
            }
            document.add(new Paragraph(" "));

            document.add(new Paragraph("3. Verification Status", sectionFont));
            document.add(new Paragraph("Status: " + user.getAccountStatus()));
            document.add(new Paragraph("Verified At: " + (user.getVerifiedAt() != null ? user.getVerifiedAt() : "PENDING")));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(
                    "Note: This is a system generated registration dossier for internal KYC verification.",
                    FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9)));

            document.close();
        } catch (DocumentException e) {
            throw new IOException("Error generating Registration PDF", e);
        }
        return out.toByteArray();
    }

    // ── INVOICE PDF ───────────────────────────────────────────────────────────

    public byte[] generateInvoicePdf(com.truckmitra.entity.common.Invoice invoice) throws IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, BRAND_BLUE);
            Paragraph header = new Paragraph("INVOICE", headerFont);
            header.setAlignment(Element.ALIGN_RIGHT);
            document.add(header);

            document.add(new Paragraph("Invoice #: " + invoice.getInvoiceNumber()));
            document.add(new Paragraph("Date: " + invoice.getBillingDate()));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Billed To:"));
            document.add(new Paragraph(invoice.getUser().getFullName()));
            document.add(new Paragraph(invoice.getUser().getEmail()));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Plan Details:"));
            document.add(new Paragraph("Plan: " + invoice.getPlanName()));
            document.add(new Paragraph("Amount: INR " + String.format("%.2f", invoice.getAmount())));
            document.add(new Paragraph("GST (18%): INR " + String.format("%.2f", invoice.getGstAmount())));
            document.add(new Paragraph("---------------------------"));
            document.add(new Paragraph("Total: INR " + String.format("%.2f", invoice.getTotalAmount()),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Status: " + invoice.getStatus(),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12,
                            "PAID".equals(invoice.getStatus()) ? BRAND_GREEN : new Color(220, 38, 38))));

            document.close();
        } catch (DocumentException e) {
            throw new IOException("Error generating Invoice PDF", e);
        }

        return out.toByteArray();
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────

    private void addBrandedHeader(Document doc, String title) throws DocumentException {
        Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, BRAND_BLUE);
        Font subFont   = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(100, 116, 139));

        Paragraph brand = new Paragraph("🚛 TruckMitra", brandFont);
        brand.setAlignment(Element.ALIGN_CENTER);
        doc.add(brand);

        Paragraph sub = new Paragraph("India's Trusted Freight Platform", subFont);
        sub.setAlignment(Element.ALIGN_CENTER);
        doc.add(sub);

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BRAND_BLUE);
        Paragraph titlePara = new Paragraph(title, titleFont);
        titlePara.setAlignment(Element.ALIGN_CENTER);
        titlePara.setSpacingBefore(10);
        doc.add(titlePara);

        doc.add(new Paragraph(
                "Generated: " + java.time.LocalDateTime.now().format(DATE_FMT),
                FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, new Color(148, 163, 184))));
        doc.add(new Paragraph(" "));
    }

    private void addSectionHeader(Document doc, String title) throws DocumentException {
        Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BRAND_BLUE);
        Paragraph p = new Paragraph(title, sectionFont);
        p.setSpacingBefore(5);
        p.setSpacingAfter(3);
        doc.add(p);
    }

    private void addFooter(Document doc) throws DocumentException {
        doc.add(new Paragraph(" "));
        doc.add(new Paragraph(
                "This is a computer-generated document. For queries: support@truckmitra.in",
                FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, new Color(148, 163, 184))));
    }

    private PdfPTable createTable(int cols) throws DocumentException {
        PdfPTable table = new PdfPTable(cols);
        table.setWidthPercentage(100);
        table.setSpacingBefore(3);
        table.setSpacingAfter(3);
        if (cols == 2) table.setWidths(new float[]{2f, 3f});
        return table;
    }

    private void addTableRow(PdfPTable table, String label, String value) {
        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(71, 85, 105));
        Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(15, 23, 42));

        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBackgroundColor(LIGHT_GRAY);
        labelCell.setPadding(5);
        labelCell.setBorderColor(new Color(226, 232, 240));

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "-", valueFont));
        valueCell.setPadding(5);
        valueCell.setBorderColor(new Color(226, 232, 240));

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private String formatEta(Integer mins) {
        if (mins == null) return "N/A";
        int hours = mins / 60;
        int remaining = mins % 60;
        if (hours == 0) return remaining + " mins";
        return hours + "h " + remaining + "m";
    }

    private String safe(String val) {
        return val != null ? val : "-";
    }
}
