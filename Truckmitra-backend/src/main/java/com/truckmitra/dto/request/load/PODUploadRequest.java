package com.truckmitra.dto.request.load;

import lombok.Data;

@Data
public class PODUploadRequest {
    private String imageUrl;
    private String signatureUrl;
    private String remarks;
}
