package com.truckmitra.controller;

// ...existing imports...
import java.util.Collections;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/cloudinary")
public class CloudinaryController {
    private static final Logger log = LoggerFactory.getLogger(CloudinaryController.class);

    @Autowired
    private com.cloudinary.Cloudinary cloudinary;

    @Autowired
    private com.truckmitra.service.CloudinaryService cloudinaryService;

    @PreAuthorize("hasAnyRole('ADMIN','TRANSPORTER','SHIPPER','DRIVER')")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        try {
            String url = cloudinaryService.uploadFile(file);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            log.error("Cloudinary upload failed", e);
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN','TRANSPORTER','SHIPPER')")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteImage(@RequestParam String publicId) {
        if (publicId == null || publicId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("publicId is required");
        }

        try {
           Map result = cloudinary.uploader().destroy(publicId, Collections.emptyMap());
            log.info("Cloudinary destroy result: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Cloudinary delete failed", e);
            return ResponseEntity.status(500).body("Failed to delete image: " + e.getMessage());
        }
    }
}
