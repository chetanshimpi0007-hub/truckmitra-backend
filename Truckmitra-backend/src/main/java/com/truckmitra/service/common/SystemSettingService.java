package com.truckmitra.service.common;

import com.truckmitra.entity.common.EnterpriseSetting;
import com.truckmitra.repository.common.EnterpriseSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final EnterpriseSettingRepository repository;

    @Cacheable(value = "enterpriseSettings", key = "#key")
    public EnterpriseSetting getSetting(String key) {
        return repository.findBySettingKey(key).orElse(null);
    }

    @CacheEvict(value = "enterpriseSettings", key = "#setting.settingKey")
    public EnterpriseSetting updateSetting(EnterpriseSetting setting) {
        return repository.save(setting);
    }
}
