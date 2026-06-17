package com.truckmitra.service.billing.impl;

import com.truckmitra.dto.response.billing.BillingSummaryDto;
import com.truckmitra.dto.response.billing.PaymentRecordDto;
import com.truckmitra.dto.response.billing.TripInvoiceDto;
import com.truckmitra.entity.billing.PaymentRecord;
import com.truckmitra.entity.billing.TripInvoice;
import com.truckmitra.entity.common.enums.InvoicePaymentStatus;
import com.truckmitra.entity.load.Trip;
import com.truckmitra.repository.billing.PaymentRecordRepository;
import com.truckmitra.repository.billing.TripInvoiceRepository;
import com.truckmitra.service.billing.BillingService;
import com.truckmitra.service.common.AuditService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final TripInvoiceRepository tripInvoiceRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final AuditService auditService;

    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    @Transactional
    public TripInvoice generateInvoiceForTrip(Trip trip) {
        if (tripInvoiceRepository.findByTripId(trip.getId()).isPresent()) {
            throw new RuntimeException("Invoice already exists for Trip: " + trip.getTripNumber());
        }

        String invoiceNumber = "INV-" + java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")
                .format(java.time.LocalDateTime.now()) + "-" + java.util.UUID.randomUUID().toString()
                .substring(0, 6).toUpperCase();

        Double totalAmount = trip.getFreightAmount() != null ? trip.getFreightAmount().doubleValue() : 0.0;
        
        // Adjust amount depending on whether we bill shipper or pay driver.
        // For standard flow, Invoice is billed to Shipper for Total Freight
        
        TripInvoice invoice = TripInvoice.builder()
                .invoiceNumber(invoiceNumber)
                .trip(trip)
                .totalAmount(totalAmount)
                .paidAmount(0.0)
                .invoiceDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(15)) // Default 15 day net payment term
                .build();

        TripInvoice savedInvoice = tripInvoiceRepository.save(invoice);
        
        // Generate PDF using existing logic or separate PDF logic (left for future enhancement, using existing trip pdf for now)
        if (trip.getFinalInvoicePdfUrl() != null) {
            savedInvoice.setPdfUrl(trip.getFinalInvoicePdfUrl());
            savedInvoice = tripInvoiceRepository.save(savedInvoice);
        }

        auditService.log("INVOICE_GENERATED", "BILLING", "Invoice " + invoiceNumber + " generated for Trip #" + trip.getTripNumber(), trip.getTransporter() != null ? trip.getTransporter().getId() : null);

        return savedInvoice;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TripInvoiceDto> searchInvoices(String search, Long driverId, Long transporterId, Long shipperId, String status, Pageable pageable) {
        String baseQuery = "FROM TripInvoice i " +
                "LEFT JOIN FETCH i.trip t " +
                "LEFT JOIN FETCH t.shipper s " +
                "LEFT JOIN FETCH t.transporter tr " +
                "LEFT JOIN FETCH t.driver d " +
                "LEFT JOIN FETCH t.vehicle v ";

        String countBaseQuery = "SELECT COUNT(i) FROM TripInvoice i " +
                "LEFT JOIN i.trip t " +
                "LEFT JOIN t.shipper s " +
                "LEFT JOIN t.transporter tr " +
                "LEFT JOIN t.driver d " +
                "LEFT JOIN t.vehicle v ";

        List<String> conditions = new ArrayList<>();
        
        if (driverId != null) conditions.add("d.id = :driverId");
        if (transporterId != null) conditions.add("tr.id = :transporterId");
        if (shipperId != null) conditions.add("s.id = :shipperId");
        if (status != null && !status.isEmpty()) conditions.add("i.status = :status");
        
        if (search != null && !search.trim().isEmpty()) {
            conditions.add("(LOWER(i.invoiceNumber) LIKE :search " +
                           "OR LOWER(t.tripNumber) LIKE :search " +
                           "OR LOWER(d.firstName) LIKE :search " +
                           "OR LOWER(tr.companyName) LIKE :search " +
                           "OR LOWER(s.firstName) LIKE :search " +
                           "OR LOWER(v.vehicleNumber) LIKE :search)");
        }

        String whereClause = conditions.isEmpty() ? "" : "WHERE " + String.join(" AND ", conditions) + " ";
        String orderClause = "ORDER BY i.createdAt DESC";

        var query = entityManager.createQuery("SELECT i " + baseQuery + whereClause + orderClause, TripInvoice.class);
        var countQuery = entityManager.createQuery(countBaseQuery + whereClause, Long.class);

        if (driverId != null) { query.setParameter("driverId", driverId); countQuery.setParameter("driverId", driverId); }
        if (transporterId != null) { query.setParameter("transporterId", transporterId); countQuery.setParameter("transporterId", transporterId); }
        if (shipperId != null) { query.setParameter("shipperId", shipperId); countQuery.setParameter("shipperId", shipperId); }
        if (status != null && !status.isEmpty()) { 
            query.setParameter("status", InvoicePaymentStatus.valueOf(status)); 
            countQuery.setParameter("status", InvoicePaymentStatus.valueOf(status)); 
        }
        if (search != null && !search.trim().isEmpty()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            query.setParameter("search", pattern);
            countQuery.setParameter("search", pattern);
        }

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<TripInvoice> invoices = query.getResultList();
        Long total = countQuery.getSingleResult();

        List<TripInvoiceDto> dtos = invoices.stream().map(this::mapToDto).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, total);
    }

    @Override
    @Transactional(readOnly = true)
    public TripInvoiceDto getInvoiceDetails(Long id) {
        TripInvoice invoice = tripInvoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return mapToDto(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public BillingSummaryDto getAdminBillingSummary() {
        return calculateSummary(null, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public BillingSummaryDto getDriverBillingSummary(Long driverId) {
        // For driver, we look at Driver amount. But TripInvoice is Total Freight.
        // We'll calculate Driver specifics from Trips directly.
        Double totalEarned = (Double) entityManager.createQuery("SELECT SUM(t.driverAmount) FROM Trip t WHERE t.driver.id = :driverId AND t.status = 'COMPLETED'")
                .setParameter("driverId", driverId).getSingleResult();
        totalEarned = totalEarned != null ? totalEarned : 0.0;
        
        return BillingSummaryDto.builder()
                .totalRevenue(totalEarned)
                .totalPaid(totalEarned) // Assuming all completed are paid to driver for now
                .totalPending(0.0)
                .totalOverdue(0.0)
                .totalInvoices((Long) entityManager.createQuery("SELECT COUNT(i) FROM TripInvoice i WHERE i.trip.driver.id = :driverId").setParameter("driverId", driverId).getSingleResult())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public BillingSummaryDto getTransporterBillingSummary(Long transporterId) {
        return calculateSummary(null, transporterId, null);
    }

    @Override
    @Transactional(readOnly = true)
    public BillingSummaryDto getShipperBillingSummary(Long shipperId) {
        return calculateSummary(null, null, shipperId);
    }

    private BillingSummaryDto calculateSummary(Long driverId, Long transporterId, Long shipperId) {
        String base = "SELECT SUM(i.totalAmount), SUM(i.paidAmount), SUM(i.pendingAmount), COUNT(i) FROM TripInvoice i JOIN i.trip t WHERE 1=1 ";
        if (driverId != null) base += " AND t.driver.id = :id";
        if (transporterId != null) base += " AND t.transporter.id = :id";
        if (shipperId != null) base += " AND t.shipper.id = :id";
        
        var query = entityManager.createQuery(base);
        if (driverId != null) query.setParameter("id", driverId);
        else if (transporterId != null) query.setParameter("id", transporterId);
        else if (shipperId != null) query.setParameter("id", shipperId);
        
        Object[] result = (Object[]) query.getSingleResult();
        Double totalRev = result[0] != null ? (Double) result[0] : 0.0;
        Double totalPaid = result[1] != null ? (Double) result[1] : 0.0;
        Double totalPending = result[2] != null ? (Double) result[2] : 0.0;
        Long totalInv = result[3] != null ? (Long) result[3] : 0L;
        
        String overdueCountQueryStr = "SELECT COUNT(i) FROM TripInvoice i JOIN i.trip t WHERE i.status = 'OVERDUE' ";
        if (driverId != null) overdueCountQueryStr += " AND t.driver.id = :id";
        if (transporterId != null) overdueCountQueryStr += " AND t.transporter.id = :id";
        if (shipperId != null) overdueCountQueryStr += " AND t.shipper.id = :id";
        var overdueQuery = entityManager.createQuery(overdueCountQueryStr);
        if (driverId != null) overdueQuery.setParameter("id", driverId);
        else if (transporterId != null) overdueQuery.setParameter("id", transporterId);
        else if (shipperId != null) overdueQuery.setParameter("id", shipperId);
        Long overdueInvs = (Long) overdueQuery.getSingleResult();
        
        String pendingCountQueryStr = "SELECT COUNT(i) FROM TripInvoice i JOIN i.trip t WHERE i.status IN ('PENDING', 'PARTIALLY_PAID') ";
        if (driverId != null) pendingCountQueryStr += " AND t.driver.id = :id";
        if (transporterId != null) pendingCountQueryStr += " AND t.transporter.id = :id";
        if (shipperId != null) pendingCountQueryStr += " AND t.shipper.id = :id";
        var pendingQuery = entityManager.createQuery(pendingCountQueryStr);
        if (driverId != null) pendingQuery.setParameter("id", driverId);
        else if (transporterId != null) pendingQuery.setParameter("id", transporterId);
        else if (shipperId != null) pendingQuery.setParameter("id", shipperId);
        Long pendingInvs = (Long) pendingQuery.getSingleResult();

        return BillingSummaryDto.builder()
                .totalRevenue(totalRev)
                .totalPaid(totalPaid)
                .totalPending(totalPending)
                .totalOverdue(0.0) // We'd need SUM(i.pendingAmount) where status = OVERDUE
                .totalInvoices(totalInv)
                .overdueInvoicesCount(overdueInvs)
                .pendingInvoicesCount(pendingInvs)
                .build();
    }

    @Override
    @Transactional
    public PaymentRecordDto recordPayment(Long invoiceId, Double amount, String paymentMethod, String transactionId, String remarks) {
        TripInvoice invoice = tripInvoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
                
        if (amount <= 0) {
            throw new RuntimeException("Payment amount must be greater than zero");
        }
        
        if (amount > invoice.getPendingAmount()) {
            throw new RuntimeException("Payment amount cannot exceed pending amount");
        }

        PaymentRecord payment = PaymentRecord.builder()
                .tripInvoice(invoice)
                .amountPaid(amount)
                .paymentMethod(paymentMethod)
                .transactionId(transactionId)
                .remarks(remarks)
                .build();
                
        PaymentRecord savedPayment = paymentRecordRepository.save(payment);
        
        invoice.setPaidAmount(invoice.getPaidAmount() + amount);
        tripInvoiceRepository.save(invoice); // PreUpdate will adjust pendingAmount and Status
        
        auditService.log("PAYMENT_RECORDED", "BILLING", "Payment of " + amount + " recorded against Invoice " + invoice.getInvoiceNumber(), null);
        
        return mapPaymentToDto(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentRecordDto> getPaymentHistory(Long invoiceId) {
        return paymentRecordRepository.findByTripInvoiceIdOrderByPaymentDateDesc(invoiceId)
                .stream().map(this::mapPaymentToDto).collect(Collectors.toList());
    }
    
    private TripInvoiceDto mapToDto(TripInvoice invoice) {
        Trip trip = invoice.getTrip();
        return TripInvoiceDto.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .tripNumber(trip != null ? trip.getTripNumber() : null)
                .loadId(trip != null && trip.getLoad() != null ? trip.getLoad().getId() : null)
                .shipperName(trip != null && trip.getShipper() != null ? trip.getShipper().getFullName() : null)
                .transporterName(trip != null && trip.getTransporter() != null ? (trip.getTransporter().getAgencyName() != null ? trip.getTransporter().getAgencyName() : trip.getTransporter().getFullName()) : null)
                .driverName(trip != null && trip.getDriver() != null ? trip.getDriver().getFullName() : null)
                .vehicleNumber(trip != null && trip.getVehicle() != null ? trip.getVehicle().getVehicleNumber() : null)
                .source(trip != null ? trip.getSource() : null)
                .destination(trip != null ? trip.getDestination() : null)
                .totalAmount(invoice.getTotalAmount())
                .paidAmount(invoice.getPaidAmount())
                .pendingAmount(invoice.getPendingAmount())
                .status(invoice.getStatus())
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .pdfUrl(invoice.getPdfUrl())
                .createdAt(invoice.getCreatedAt())
                .build();
    }
    
    private PaymentRecordDto mapPaymentToDto(PaymentRecord payment) {
        return PaymentRecordDto.builder()
                .id(payment.getId())
                .tripInvoiceId(payment.getTripInvoice().getId())
                .invoiceNumber(payment.getTripInvoice().getInvoiceNumber())
                .amountPaid(payment.getAmountPaid())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .remarks(payment.getRemarks())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportInvoicesToExcel(String search, Long driverId, Long transporterId, Long shipperId, String status) {
        Page<TripInvoiceDto> page = searchInvoices(search, driverId, transporterId, shipperId, status, org.springframework.data.domain.PageRequest.of(0, 10000));
        
        StringBuilder sb = new StringBuilder();
        sb.append("Invoice Number,Trip Number,Shipper,Transporter,Driver,Vehicle,Source,Destination,Total Amount,Paid Amount,Pending Amount,Status,Invoice Date\n");
        
        for (TripInvoiceDto dto : page.getContent()) {
            sb.append(escapeCsv(dto.getInvoiceNumber())).append(",")
              .append(escapeCsv(dto.getTripNumber())).append(",")
              .append(escapeCsv(dto.getShipperName())).append(",")
              .append(escapeCsv(dto.getTransporterName())).append(",")
              .append(escapeCsv(dto.getDriverName())).append(",")
              .append(escapeCsv(dto.getVehicleNumber())).append(",")
              .append(escapeCsv(dto.getSource())).append(",")
              .append(escapeCsv(dto.getDestination())).append(",")
              .append(dto.getTotalAmount()).append(",")
              .append(dto.getPaidAmount()).append(",")
              .append(dto.getPendingAmount()).append(",")
              .append(dto.getStatus()).append(",")
              .append(dto.getInvoiceDate()).append("\n");
        }
        
        return sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }
    
    private String escapeCsv(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }
}
