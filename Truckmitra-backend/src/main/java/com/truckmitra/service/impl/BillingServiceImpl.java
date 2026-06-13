package com.truckmitra.service.impl;
 
import com.truckmitra.entity.common.BillingDetails;
import com.truckmitra.entity.common.Invoice;
import com.truckmitra.entity.common.UserSubscription;
import com.truckmitra.entity.common.EnterpriseSetting;
import com.truckmitra.entity.user.User;
import com.truckmitra.repository.common.BillingRepository;
import com.truckmitra.repository.common.InvoiceRepository;
import com.truckmitra.service.PdfService;
import com.truckmitra.service.common.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
 
@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {
 
    private final BillingRepository billingRepository;
    private final InvoiceRepository invoiceRepository;
    private final PdfService pdfService;
    private final com.truckmitra.service.common.AuditService auditService;
    private final com.truckmitra.repository.common.EnterpriseSettingRepository enterpriseSettingRepository;
 
    @Override
    public BillingDetails getBillingDetails(User user) {
        return billingRepository.findByUser(user)
                .orElse(BillingDetails.builder().user(user).build());
    }
 
    @Override
    @Transactional
    public BillingDetails updateBillingDetails(BillingDetails details, User user) {
        BillingDetails existing = billingRepository.findByUser(user)
                .orElse(BillingDetails.builder().user(user).build());
        
        existing.setCompanyName(details.getCompanyName());
        existing.setGstNumber(details.getGstNumber());
        existing.setCompanyAddress(details.getCompanyAddress());
        existing.setInvoicePrefix(details.getInvoicePrefix());
        existing.setThemeColors(details.getThemeColors());
        existing.setLogoUrl(details.getLogoUrl());
        
        return billingRepository.save(existing);
    }
 
    @Override
    @Transactional
    public Invoice generateInvoice(UserSubscription subscription) {
        EnterpriseSetting settings = enterpriseSettingRepository.findBySettingKey("GLOBAL_PLATFORM")
                .orElse(EnterpriseSetting.builder()
                        .companyName("TruckMitra")
                        .gstNumber("UNREGISTERED")
                        .companyAddress("Head Office")
                        .invoicePrefix("TM")
                        .build());
        
        double amount = subscription.getPlan().getPrice();
        double gstRate = 18.0;
        double gstAmount = amount * (gstRate / 100);
        double totalAmount = amount + gstAmount;
        
        String invoiceNumber = settings.getInvoicePrefix() + "-" + LocalDate.now().getYear() + "-" + String.format("%06d", (invoiceRepository.count() + 1));
 
        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .user(subscription.getUser())
                .subscription(subscription)
                .planName(subscription.getPlan().getName())
                .amount(amount)
                .gstAmount(gstAmount)
                .gstRate(gstRate)
                .totalAmount(totalAmount)
                .status("PAID")
                .billingDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(7))
                .billingGstNumber(settings.getGstNumber())
                .billingAddress(settings.getCompanyAddress())
                .billingLogoUrl(settings.getCompanyLogo())
                .build();
        
        Invoice saved = invoiceRepository.save(invoice);
        
        // Log Audit Trail
        auditService.logAction("INVOICE_CREATION", "Generated invoice " + invoiceNumber + " for user " + subscription.getUser().getId(), subscription.getUser());
        
        return saved;
    }
 
    @Override
    public List<Invoice> getMyInvoices(User user) {
        return invoiceRepository.findByUser(user);
    }
 
    @Override
    public byte[] downloadInvoice(String invoiceNumber, User user) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        if (!invoice.getUser().getId().equals(user.getId()) && user.getRole() != com.truckmitra.entity.common.enums.Role.ADMIN) {
            throw new RuntimeException("Unauthorized to download this invoice");
        }
        
        try {
            return pdfService.generateInvoicePdf(invoice);
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }
}
