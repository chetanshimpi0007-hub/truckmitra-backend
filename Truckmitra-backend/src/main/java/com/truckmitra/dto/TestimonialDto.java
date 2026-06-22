package com.truckmitra.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TestimonialDto {
    private Long id;
    private String authorName;
    private String authorRole;
    private String company;
    private String content;
    private Integer rating;
    private String imageUrl;
    private LocalDateTime createdAt;
}
