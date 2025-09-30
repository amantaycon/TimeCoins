package com.timecoins.service;

import com.timecoins.dto.VotingDto;
import com.timecoins.model.CompanyList;
import com.timecoins.model.CompanyVote;
import com.timecoins.model.VotingType;
import com.timecoins.repository.CompanyListRepository;
import com.timecoins.repository.CompanyVoteRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyVotingService implements CompanyVotingServiceIn {

    private final CompanyVoteRepository voteRepository;
    private final CompanyListRepository companyRepository;

    /**
     * Add new vote or update existing vote
     */
    @Override
    public VotingDto addOrUpdateVote(Long userId, Long companyId, VotingType voteType) {
        Optional<CompanyList> companyOpt = companyRepository.findById(companyId);
        if (companyOpt.isEmpty()) {
        	return VotingDto.builder()
        			.message("Company not found!")
        			.build();
        }

        CompanyList company = companyOpt.get();

        Optional<CompanyVote> existingVote =
                voteRepository.findByCompanyAndUserId(company, userId);

        CompanyVote vote;
        if (existingVote.isPresent()) {
            // 🔄 update existing vote
            vote = existingVote.get();
            vote.setVote(voteType);
        } else {
            // 🆕 add new vote
            vote = CompanyVote.builder()
                    .company(company)
                    .userId(userId)
                    .vote(voteType)
                    .build();
        }

        voteRepository.save(vote);

        Long upVotes = voteRepository.countUpVotes(companyId);
        Long downVotes = voteRepository.countDownVotes(companyId);

        return VotingDto.builder()
        		.message("Vote saved successfully!")
        		.userVote(voteType)
        		.upVotes(upVotes)
        		.companyId(companyId)
        		.downVotes(downVotes)
        		.build();
    }
}
