package com.timecoins.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompanyListDto {
	private Long id;
	private String companyName;
	private String tickerSymbol; // e.g., TCS, INFY
	private BigDecimal sharesPercentage;
	private LocalDateTime createAt;
}
