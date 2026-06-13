package com.truckmitra.service.common;

import com.truckmitra.entity.common.EnterpriseSetting;

public interface EnterpriseSettingService {
    EnterpriseSetting getGlobalSettings();
    EnterpriseSetting updateGlobalSettings(EnterpriseSetting settings);
}
