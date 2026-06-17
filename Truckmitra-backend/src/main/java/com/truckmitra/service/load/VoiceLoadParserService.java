package com.truckmitra.service.load;

import com.truckmitra.dto.request.VoiceLoadParseRequest;
import com.truckmitra.dto.response.VoiceLoadParseResponse;

public interface VoiceLoadParserService {
    VoiceLoadParseResponse parseLoadTranscript(VoiceLoadParseRequest request);
}
