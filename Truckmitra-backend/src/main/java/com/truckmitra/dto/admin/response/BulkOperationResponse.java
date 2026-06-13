// src/main/java/com/truckmitra/dto/admin/response/BulkOperationResponse.java
package com.truckmitra.dto.admin.response;

public record BulkOperationResponse(
    int successCount,
    int failCount
) {}