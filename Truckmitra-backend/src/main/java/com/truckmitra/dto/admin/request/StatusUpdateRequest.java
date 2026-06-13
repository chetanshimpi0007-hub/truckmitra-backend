// src/main/java/com/truckmitra/dto/admin/request/StatusUpdateRequest.java
package com.truckmitra.dto.admin.request;

import com.truckmitra.entity.common.enums.AccountStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
    @NotNull(message = "Status is required")
    AccountStatus status,
    
    String reason
) {}