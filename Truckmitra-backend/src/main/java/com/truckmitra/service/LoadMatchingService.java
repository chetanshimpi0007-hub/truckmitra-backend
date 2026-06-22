package com.truckmitra.service;

import com.truckmitra.dto.MatchScoreDTO;
import com.truckmitra.dto.RecommendationDTO;
import com.truckmitra.entity.user.TransporterPreference;

import java.util.List;

public interface LoadMatchingService {
    
    MatchScoreDTO calculateMatchScore(Long loadId, Long transporterId);
    
    void processNewLoad(Long loadId);
    
    List<RecommendationDTO> getRecommendationsForTransporter(Long transporterId);
    
    List<RecommendationDTO> getRecommendationsForLoad(Long loadId, Long requesterUserId);
    
    TransporterPreference saveOrUpdatePreference(Long transporterId, TransporterPreference preference);
    
    TransporterPreference getPreference(Long transporterId);
}
