package com.timecoins.service;

import java.math.BigDecimal;
import java.util.List;

import com.timecoins.dto.AggregatedCoinHistoryDto;
import com.timecoins.dto.CompanyListDto;

public interface ValueFluctuationServiceIn {
	public boolean addNewCompanyShares(
            String companyName,
            String tickerSymbol,
            BigDecimal sharePrice,
            BigDecimal shareToken,
            BigDecimal totalToken
    );
	public List<AggregatedCoinHistoryDto> getListOfValueHistory(String range);
	public List<CompanyListDto> getListOfCompany();
	public BigDecimal getCoinValueInRuppees();
}
