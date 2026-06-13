package com.truckmitra.service.impl.admin;

import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.LoadRepository;
import com.truckmitra.repository.TripRepository;
import com.truckmitra.service.admin.ReportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final TripRepository tripRepository;
    private final LoadRepository loadRepository;

    @Override
    public byte[] generateRevenueReport(String format, String startDate, String endDate) {
        List<Trip> trips = tripRepository.findAll(); // simplified for now
        
        if ("EXCEL".equalsIgnoreCase(format)) {
            return generateExcelReport("Revenue Report", new String[]{"Trip ID", "Date", "Amount", "GST", "Total"}, trips);
        } else {
            return generateCsvReport(new String[]{"Trip ID", "Date", "Amount", "GST", "Total"}, trips);
        }
    }

    @Override
    public byte[] generateFleetReport(String format, Long transporterId) {
        // Implementation for fleet report
        return new byte[0];
    }

    @Override
    public byte[] generateLoadReport(String format, String status) {
        // Implementation for load report
        return new byte[0];
    }

    @Override
    public byte[] generateDriverPerformanceReport(String format, Long transporterId) {
        // Implementation for driver performance
        return new byte[0];
    }

    private byte[] generateExcelReport(String title, String[] headers, List<Trip> data) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(title);
            
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            int rowIdx = 1;
            for (Trip trip : data) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(trip.getId());
                row.createCell(1).setCellValue(trip.getCreatedAt().toString());
                row.createCell(2).setCellValue(trip.getFreightAmount() != null ? trip.getFreightAmount().doubleValue() : 0.0);
                row.createCell(3).setCellValue(0.0); // GST placeholder
                row.createCell(4).setCellValue(trip.getFreightAmount() != null ? trip.getFreightAmount().doubleValue() : 0.0);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Excel generation failed", e);
        }
    }

    private byte[] generateCsvReport(String[] headers, List<Trip> data) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.join(",", headers)).append("\n");
        for (Trip trip : data) {
            sb.append(trip.getId()).append(",")
              .append(trip.getCreatedAt()).append(",")
              .append(trip.getFreightAmount()).append(",")
              .append("0.0").append(",")
              .append(trip.getFreightAmount()).append("\n");
        }
        return sb.toString().getBytes();
    }
}
