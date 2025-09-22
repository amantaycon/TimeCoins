package com.timecoins.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AggregatedCoinHistoryDto {
	private LocalDateTime period;   // start of day/week/month
    private Double avgValue;        // average value in that period
    private Double minValue;        // lowest value in that period
    private Double maxValue;        // highest value in that period
}
