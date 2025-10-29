package com.timecoins.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TimecoinsDto {
	private BigDecimal totalTimeCoins;
	private BigDecimal remainingTimecoins;
}
