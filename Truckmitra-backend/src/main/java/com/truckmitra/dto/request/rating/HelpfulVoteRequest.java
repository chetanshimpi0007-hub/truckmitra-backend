package com.truckmitra.dto.request.rating;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HelpfulVoteRequest {
    @NotNull
    private Long ratingId;
}
