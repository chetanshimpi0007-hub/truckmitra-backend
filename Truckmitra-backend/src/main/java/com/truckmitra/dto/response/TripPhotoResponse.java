package com.truckmitra.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripPhotoResponse {
    private Long id;
    private String photoType;
    private String photoUrl;
    private LocalDateTime uploadedAt;
    private String uploadedBy;
}
