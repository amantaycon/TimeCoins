package com.timecoins.service;

import java.math.BigDecimal;
import java.util.List;

import com.timecoins.dto.AggregatedCoinHistoryDto;
import com.timecoins.dto.CompanyListDto;

public interface ValueFluctuationServiceIn {
	public CompanyListDto addCompany(CompanyListDto companyDetails,Long userId);
	public BigDecimal getCoinValueInRuppees();
	public List<CompanyListDto> getListOfCompany();
	public List<AggregatedCoinHistoryDto> getListOfValueHistory(String range);
	public boolean approveCompany(Long id, Long userId);
}
