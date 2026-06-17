package com.truckmitra.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class VoiceLoadParseRequest {
    @NotBlank(message = "Transcript is required")
    private String transcript;
}
