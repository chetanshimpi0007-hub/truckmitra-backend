package com.truckmitra.service.impl;

import com.truckmitra.entity.common.Invoice;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.common.InvoiceRepository;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.service.common.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service("commonReportServiceImpl")
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final TripRepository tripRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public byte[] generateTripsReportCsv(List<Long> tripIds) {
        List<Trip> trips = tripRepository.findAllById(tripIds);
        StringBuilder csv = new StringBuilder();
        csv.append("Trip ID,Source,Destination,Vehicle,Driver,Distance (km),Carbon Emission (kg),Total Amount (INR),Status\n");

        for (Trip trip : trips) {
            csv.append(trip.getId()).append(",")
               .append(escapeCsv(trip.getLoad().getSource())).append(",")
               .append(escapeCsv(trip.getLoad().getDestination())).append(",")
               .append(trip.getVehicle().getVehicleNumber()).append(",")
               .append(escapeCsv(trip.getDriver().getFullName())).append(",")
               .append(String.format("%.2f", trip.getDistance())).append(",")
               .append(String.format("%.2f", trip.getCarbonEmission())).append(",")
               .append(String.format("%.2f", trip.getFreightAmount())).append(",")
               .append(trip.getStatus()).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] generateInvoicesReportCsv(List<Long> invoiceIds) {
        List<Invoice> invoices = invoiceRepository.findAllById(invoiceIds);
        StringBuilder csv = new StringBuilder();
        csv.append("Invoice Number,User,Plan,Amount,GST Amount,Total Amount,Status,Billing Date\n");

        for (Invoice inv : invoices) {
            csv.append(inv.getInvoiceNumber()).append(",")
               .append(escapeCsv(inv.getUser().getFullName())).append(",")
               .append(inv.getPlanName()).append(",")
               .append(inv.getAmount()).append(",")
               .append(inv.getGstAmount()).append(",")
               .append(inv.getTotalAmount()).append(",")
               .append(inv.getStatus()).append(",")
               .append(inv.getBillingDate()).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] generateSubscriptionReportCsv() {
        List<Invoice> subscriptions = invoiceRepository.findAll(); // simplified
        return generateInvoicesReportCsv(subscriptions.stream().map(Invoice::getId).toList());
    }

    private String escapeCsv(String data) {
        if (data == null) return "";
        return "\"" + data.replace("\"", "\"\"") + "\"";
    }
}
