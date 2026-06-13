package com.truckmitra.dto.request.user;

import jakarta.validation.constraints.NotBlank;

public record DocumentUploadRequest(
    @NotBlank(message = "Document type is required")
    String docType,
    String docNumber,
    @NotBlank(message = "Document front image URL is required")
    String docFrontImageUrl,
    String docBackImageUrl
) {}
