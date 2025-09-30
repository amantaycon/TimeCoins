package com.timecoins.service;

import com.timecoins.dto.VotingDto;
import com.timecoins.model.VotingType;

public interface CompanyVotingServiceIn {
    VotingDto addOrUpdateVote(Long userId, Long companyId, VotingType vote);
}
