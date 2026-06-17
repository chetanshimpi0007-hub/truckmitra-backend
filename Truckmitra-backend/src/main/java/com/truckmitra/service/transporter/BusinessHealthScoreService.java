package com.truckmitra.service.transporter;

import com.truckmitra.dto.response.BusinessHealthScoreResponse;

public interface BusinessHealthScoreService {
    BusinessHealthScoreResponse calculateForTransporter(Long transporterId);
}
