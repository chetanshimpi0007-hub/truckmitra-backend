package com.truckmitra.controller.admin;

import com.truckmitra.dto.response.ApiResponse;
import com.truckmitra.dto.response.wallet.TransactionResponse;
import com.truckmitra.service.wallet.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/transactions")
@RequiredArgsConstructor
@Tag(name = "Admin Transactions", description = "Admin API for managing all transactions")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTransactionController {

    private final WalletService walletService;

    @GetMapping
    @Operation(summary = "Get all transactions across the system")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<TransactionResponse> transactions = walletService.getAllTransactions(pageable);
        return ResponseEntity.ok(ApiResponse.success("Transactions fetched successfully", transactions));
    }
}
