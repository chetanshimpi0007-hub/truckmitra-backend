package com.truckmitra.controller.admin;

import com.truckmitra.entity.common.EnterpriseSetting;
import com.truckmitra.service.common.EnterpriseSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class EnterpriseSettingController {

    private final EnterpriseSettingService settingService;

    @GetMapping
    public ResponseEntity<EnterpriseSetting> getSettings() {
        return ResponseEntity.ok(settingService.getGlobalSettings());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnterpriseSetting> updateSettings(@RequestBody EnterpriseSetting settings) {
        return ResponseEntity.ok(settingService.updateGlobalSettings(settings));
    }
}
