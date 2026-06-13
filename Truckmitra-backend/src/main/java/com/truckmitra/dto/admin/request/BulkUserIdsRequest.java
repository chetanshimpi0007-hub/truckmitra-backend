// src/main/java/com/truckmitra/dto/admin/request/BulkUserIdsRequest.java
package com.truckmitra.dto.admin.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record BulkUserIdsRequest(
    @NotEmpty(message = "User IDs list cannot be empty")
    List<Long> userIds
) {}