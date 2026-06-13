// src/main/java/com/truckmitra/dto/admin/request/SuspendRequest.java
package com.truckmitra.dto.admin.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SuspendRequest(
    @NotBlank(message = "Suspension reason is required")
    @Size(min = 5, max = 500, message = "Reason must be between 5 and 500 characters")
    String reason
) {}