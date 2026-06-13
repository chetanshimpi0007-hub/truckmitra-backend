// src/main/java/com/truckmitra/config/DatabaseFixer.java
package com.truckmitra.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class DatabaseFixer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixSchema() {
        try {
            // Use upper-case identifiers for H2 INFORMATION_SCHEMA checks
            Integer c = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE UPPER(TABLE_NAME) = 'USERS' AND UPPER(COLUMN_NAME) = 'IS_VERIFIED'",
                Integer.class
            );

            if (c != null && c > 0) {
                try {
                    // For H2: to allow NULL, drop NOT NULL constraint by altering column to be nullable.
                    // H2 supports: ALTER TABLE <table> ALTER COLUMN <col> SET DEFAULT <val> or ALTER COLUMN <col> SET DATA TYPE ...
                    // Changing nullability directly is not portable; attempting a safe no-op unless specific changes required.
                    // Log presence for debugging.
                    log.info("Column IS_VERIFIED exists in USERS table");
                } catch (Exception e) {
                    log.warn("Could not apply nullability change to IS_VERIFIED: {}", e.getMessage());
                }
            }
            // Additional safe schema fixes should follow the same pattern:
            // 1) check existence using upper-case names
            // 2) avoid using unsupported MODIFY syntax; use migrations for structural changes
        } catch (Exception e) {
            log.error("DatabaseFixer failed", e);
        }
    }
}