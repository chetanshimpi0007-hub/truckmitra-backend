package com.truckmitra.controller.common;

import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.entity.common.BillingDetails;
import com.truckmitra.entity.common.Invoice;
import com.truckmitra.entity.user.User;
import com.truckmitra.security.SecurityUtils;
import com.truckmitra.service.auth.AuthService;
import com.truckmitra.service.common.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;
    private final AuthService authService;
    private final com.truckmitra.repository.auth.UserRepository userRepository;

    @GetMapping("/details")
    public ResponseEntity<ApiResponse<BillingDetails>> getDetails() {
        User user = getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Billing details fetched", billingService.getBillingDetails(user)));
    }

    @PostMapping("/details")
    public ResponseEntity<ApiResponse<BillingDetails>> updateDetails(@RequestBody BillingDetails details) {
        User user = getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Billing details updated", billingService.updateBillingDetails(details, user)));
    }

    @GetMapping("/invoices")
    public ResponseEntity<ApiResponse<List<Invoice>>> getInvoices() {
        User user = getCurrentAuthenticatedUser();
        return ResponseEntity.ok(ApiResponse.success("Invoices fetched", billingService.getMyInvoices(user)));
    }

    @GetMapping("/invoices/{invoiceNumber}/download")
    public ResponseEntity<ByteArrayResource> downloadInvoice(@PathVariable String invoiceNumber) {
        User user = getCurrentAuthenticatedUser();
        byte[] data = billingService.downloadInvoice(invoiceNumber, user);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice-" + invoiceNumber + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(data.length)
                .body(resource);
    }

    private User getCurrentAuthenticatedUser() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new com.truckmitra.exception.UnauthorizedException("User session not found");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new com.truckmitra.exception.ResourceNotFoundException("User", "id", userId));
    }
}
