package com.truckmitra.repository.common;

import com.truckmitra.entity.common.EnterpriseSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EnterpriseSettingRepository extends JpaRepository<EnterpriseSetting, Long> {
    Optional<EnterpriseSetting> findBySettingKey(String settingKey);
}
