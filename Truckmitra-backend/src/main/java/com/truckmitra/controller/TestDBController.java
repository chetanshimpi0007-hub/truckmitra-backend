package com.truckmitra.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/testdb")
public class TestDBController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/query")
    public List<Map<String, Object>> query(@RequestParam String sql) {
        return jdbcTemplate.queryForList(sql);
    }
}
