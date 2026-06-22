package com.truckmitra.dto.request.common;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscriptionCreateRequestDTO {
    @NotNull(message = "Plan ID is required")
    private Long planId;
}
