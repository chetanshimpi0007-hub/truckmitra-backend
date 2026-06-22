package com.truckmitra.service.impl;

import com.truckmitra.dto.TestimonialDto;
import com.truckmitra.entity.Testimonial;
import com.truckmitra.repository.TestimonialRepository;
import com.truckmitra.service.TestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestimonialServiceImpl implements TestimonialService {

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Override
    public List<TestimonialDto> getAllTestimonials() {
        return testimonialRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private TestimonialDto mapToDto(Testimonial t) {
        TestimonialDto dto = new TestimonialDto();
        dto.setId(t.getId());
        dto.setAuthorName(t.getAuthorName());
        dto.setAuthorRole(t.getAuthorRole());
        dto.setCompany(t.getCompany());
        dto.setContent(t.getContent());
        dto.setRating(t.getRating());
        dto.setImageUrl(t.getImageUrl());
        dto.setCreatedAt(t.getCreatedAt());
        return dto;
    }
}
