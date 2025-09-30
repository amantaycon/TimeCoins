package com.timecoins.repository;

import com.timecoins.model.CompanyVote;
import com.timecoins.model.CompanyList;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyVoteRepository extends JpaRepository<CompanyVote, Long> {

    // check if user already voted for this company
    Optional<CompanyVote> findByCompanyAndUserId(CompanyList company, Long userId);

    @Query("SELECT COUNT(v) FROM CompanyVote v WHERE v.company.id = :companyId AND v.vote = com.timecoins.model.VotingType.UP")
    Long countUpVotes(Long companyId);

    @Query("SELECT COUNT(v) FROM CompanyVote v WHERE v.company.id = :companyId AND v.vote = com.timecoins.model.VotingType.DOWN")
    Long countDownVotes(Long companyId);
}
