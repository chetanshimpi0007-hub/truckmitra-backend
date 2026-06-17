package com.truckmitra.service.load.impl;

import com.truckmitra.dto.request.VoiceLoadParseRequest;
import com.truckmitra.dto.response.VoiceLoadParseResponse;
import com.truckmitra.service.load.VoiceLoadParserService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class VoiceLoadParserServiceImpl implements VoiceLoadParserService {

    private static final Map<String, String> CITY_DICTIONARY = new HashMap<>();
    private static final Map<String, String> MATERIAL_DICTIONARY = new HashMap<>();

    static {
        // Marathi/Hindi to English mappings
        CITY_DICTIONARY.put("नाशिक", "Nashik");
        CITY_DICTIONARY.put("पुणे", "Pune");
        CITY_DICTIONARY.put("मुंबई", "Mumbai");
        CITY_DICTIONARY.put("दिल्ली", "Delhi");
        CITY_DICTIONARY.put("जयपूर", "Jaipur");
        CITY_DICTIONARY.put("nashik", "Nashik");
        CITY_DICTIONARY.put("pune", "Pune");
        CITY_DICTIONARY.put("mumbai", "Mumbai");
        CITY_DICTIONARY.put("delhi", "Delhi");
        CITY_DICTIONARY.put("jaipur", "Jaipur");

        MATERIAL_DICTIONARY.put("सिमेंट", "Cement");
        MATERIAL_DICTIONARY.put("cement", "Cement");
        MATERIAL_DICTIONARY.put("स्टील", "Steel");
        MATERIAL_DICTIONARY.put("steel", "Steel");
    }

    @Override
    public VoiceLoadParseResponse parseLoadTranscript(VoiceLoadParseRequest request) {
        String transcript = request.getTranscript().toLowerCase();
        
        String sourceCity = extractSourceCity(transcript);
        String destinationCity = extractDestinationCity(transcript);
        Double weight = extractWeight(transcript);
        String material = extractMaterial(transcript);
        BigDecimal amount = extractAmount(transcript);
        String vehicleType = extractVehicleType(transcript);

        double score = 0.0;
        if (sourceCity != null) score += 0.2;
        if (destinationCity != null) score += 0.2;
        if (weight != null) score += 0.2;
        if (material != null) score += 0.2;
        if (amount != null) score += 0.2;

        return VoiceLoadParseResponse.builder()
                .sourceCity(sourceCity)
                .destinationCity(destinationCity)
                .material(material)
                .weight(weight)
                .amount(amount)
                .vehicleType(vehicleType)
                .confidenceScore(Math.min(1.0, score))
                .build();
    }

    private String extractSourceCity(String transcript) {
        // Look for typical prefixes/suffixes or just the city name first
        for (Map.Entry<String, String> entry : CITY_DICTIONARY.entrySet()) {
            // Match if transcript starts with city, or contains city + "ते" / "से" / "to"
            if (transcript.contains(entry.getKey() + " ते") || 
                transcript.contains(entry.getKey() + " से") || 
                transcript.contains(entry.getKey() + " to") ||
                transcript.startsWith(entry.getKey() + " ")) {
                return entry.getValue();
            }
        }
        return null;
    }

    private String extractDestinationCity(String transcript) {
        for (Map.Entry<String, String> entry : CITY_DICTIONARY.entrySet()) {
            if (transcript.contains("ते " + entry.getKey()) || 
                transcript.contains("से " + entry.getKey()) || 
                transcript.contains("to " + entry.getKey())) {
                return entry.getValue();
            }
        }
        return null;
    }

    private Double extractWeight(String transcript) {
        // match number before "टन", "ton", "tonne"
        Pattern pattern = Pattern.compile("(\\d+(\\.\\d+)?)\\s*(टन|ton|tonne)");
        Matcher matcher = pattern.matcher(transcript);
        if (matcher.find()) {
            try {
                return Double.parseDouble(matcher.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private String extractMaterial(String transcript) {
        for (Map.Entry<String, String> entry : MATERIAL_DICTIONARY.entrySet()) {
            if (transcript.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return null;
    }

    private BigDecimal extractAmount(String transcript) {
        // match number before or after "रुपये", "rs", "rupees", or just last number
        Pattern pattern = Pattern.compile("(\\d+(\\.\\d+)?)\\s*(रुपये|rs|rupees)");
        Matcher matcher = pattern.matcher(transcript);
        if (matcher.find()) {
            try {
                return new BigDecimal(matcher.group(1));
            } catch (Exception e) {
                return null;
            }
        }
        
        // Match standalone big number (e.g. 25000, 40000)
        Pattern standalonePattern = Pattern.compile("(\\d{4,})");
        Matcher standaloneMatcher = standalonePattern.matcher(transcript);
        if (standaloneMatcher.find()) {
            try {
                return new BigDecimal(standaloneMatcher.group(1));
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    private String extractVehicleType(String transcript) {
        if (transcript.contains("truck") || transcript.contains("ट्रक")) return "TRUCK";
        if (transcript.contains("trailer") || transcript.contains("ट्रेलर")) return "TRAILER";
        if (transcript.contains("container") || transcript.contains("कंटेनर")) return "CONTAINER";
        return null;
    }
}
