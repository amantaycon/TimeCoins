package com.timecoins.dto;

import com.timecoins.model.VotingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VotingDto {
    private String message;
    private VotingType userVote;  // user’s current vote (UP/DOWN/null)
    private Long upVotes;
    private Long downVotes;
    private Long companyId;
}
