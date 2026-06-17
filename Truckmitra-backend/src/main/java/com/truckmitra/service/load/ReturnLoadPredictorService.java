package com.truckmitra.service.load;

import com.truckmitra.dto.response.ReturnLoadSuggestionResponse;
import java.util.List;

public interface ReturnLoadPredictorService {
    List<ReturnLoadSuggestionResponse> getSuggestions(Long tripId);
}
