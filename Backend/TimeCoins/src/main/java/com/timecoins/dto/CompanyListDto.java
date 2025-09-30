package com.timecoins.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.timecoins.model.VotingType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CompanyListDto {
	private Long id;
	private String companyName;
	private String tickerSymbol; // e.g., TCS, INFY
	private BigDecimal sharesPercentage;
	private BigDecimal sharePrice;  // Current price of one percentage share in Rupees
    private BigDecimal shareToken;  // Percentage weight in TimeCoins
    private BigDecimal totalToken;  // Total Token of Company for calculating percentage of shares
	private BigDecimal totalValueInTimecoins;
	private String email;
	private String website;
	private Boolean approve;
	private LocalDateTime createAt;
	
	private Long upVotes;
    private Long downVotes;
    private VotingType userVote; // null if user has not voted
}
