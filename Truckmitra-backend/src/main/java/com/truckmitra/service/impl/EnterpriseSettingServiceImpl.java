package com.truckmitra.service.impl;

import com.truckmitra.entity.common.EnterpriseSetting;
import com.truckmitra.repository.common.EnterpriseSettingRepository;
import com.truckmitra.service.common.EnterpriseSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EnterpriseSettingServiceImpl implements EnterpriseSettingService {

    private final EnterpriseSettingRepository repository;

    @Override
    public EnterpriseSetting getGlobalSettings() {
        return repository.findBySettingKey("GLOBAL_PLATFORM")
                .orElse(EnterpriseSetting.builder()
                        .settingKey("GLOBAL_PLATFORM")
                        .companyName("TruckMitra")
                        .invoicePrefix("TM")
                        .build());
    }

    @Override
    @Transactional
    public EnterpriseSetting updateGlobalSettings(EnterpriseSetting settings) {
        EnterpriseSetting existing = repository.findBySettingKey("GLOBAL_PLATFORM")
                .orElse(EnterpriseSetting.builder().settingKey("GLOBAL_PLATFORM").build());
        
        existing.setCompanyName(settings.getCompanyName());
        existing.setCompanyLogo(settings.getCompanyLogo());
        existing.setGstNumber(settings.getGstNumber());
        existing.setCompanyAddress(settings.getCompanyAddress());
        existing.setInvoicePrefix(settings.getInvoicePrefix());
        existing.setThemeColors(settings.getThemeColors());
        
        return repository.save(existing);
    }
}
