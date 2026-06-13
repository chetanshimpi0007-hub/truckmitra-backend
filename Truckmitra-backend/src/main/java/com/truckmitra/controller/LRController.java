package com.truckmitra.controller;

import com.truckmitra.entity.load.LorryReceipt;
import com.truckmitra.service.LRService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/lr")
public class LRController {

    @Autowired
    private LRService lrService;

    /**
     * Returns LorryReceipt metadata JSON for the given trip.
     * Also auto-generates the LR if it doesn't exist yet.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'SHIPPER', 'TRANSPORTER', 'DRIVER')")
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getLRByTrip(@PathVariable Long tripId) {
        try {
            // Auto-generate LR if missing
            LorryReceipt lr = lrService.getLRByTripId(tripId)
                    .orElseGet(() -> {
                        try {
                            return lrService.generateLR(tripId);
                        } catch (Exception e) {
                            log.error("LR auto-generation failed for trip {}: {}", tripId, e.getMessage(), e);
                            return null;
                        }
                    });
            if (lr == null) {
                return ResponseEntity.status(404).body("LR could not be generated for trip " + tripId);
            }
            return ResponseEntity.ok(lr);
        } catch (Exception e) {
            log.error("Error getting LR for trip {}: {}", tripId, e.getMessage(), e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /**
     * Serves the LR as a PDF byte stream directly — no Cloudinary required.
     * URL: GET /api/lr/trip/{tripId}/pdf
     * The frontend opens this URL in a new tab to view/download the LR.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'SHIPPER', 'TRANSPORTER', 'DRIVER')")
    @GetMapping("/trip/{tripId}/pdf")
    public ResponseEntity<byte[]> getLRPdf(@PathVariable Long tripId) {
        try {
            LorryReceipt lr = lrService.getLRByTripId(tripId)
                    .orElseGet(() -> {
                        try { return lrService.generateLR(tripId); }
                        catch (Exception e) { throw new RuntimeException("LR generation failed: " + e.getMessage()); }
                    });

            byte[] pdfBytes = lrService.generateLRPDF(lr);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "inline; filename=LR_" + lr.getLrNumber() + ".pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            log.error("Failed to serve LR PDF for trip {}: {}", tripId, e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/verify/{lrNumber}")
    public ResponseEntity<?> verifyLR(@PathVariable String lrNumber) {
        return lrService.getLRByNumber(lrNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TRANSPORTER')")
    @PostMapping("/generate/{tripId}")
    public ResponseEntity<?> forceGenerateLR(@PathVariable Long tripId) {
        try {
            LorryReceipt lr = lrService.generateLR(tripId);
            return ResponseEntity.ok(lr);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Generation failed: " + e.getMessage());
        }
    }
}
