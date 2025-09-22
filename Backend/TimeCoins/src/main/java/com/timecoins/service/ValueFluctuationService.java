package com.timecoins.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.timecoins.dto.AggregatedCoinHistoryDto;
import com.timecoins.dto.CompanyListDto;
import com.timecoins.model.CoinsValueHistory;
import com.timecoins.model.CompanyList;
import com.timecoins.model.TotalTimeCoins;
import com.timecoins.repository.CoinsValueHistoryRepository;
import com.timecoins.repository.CompanyListRepository;
import com.timecoins.repository.TotalTimeCoinsRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ValueFluctuationService implements ValueFluctuationServiceIn {

    private final CompanyListRepository companyListRepository;
    private final CoinsValueHistoryRepository coinsValueHistoryRepository;
    private final TotalTimeCoinsRepository totalTimeCoinsRepository;
    
    @Override
    public List<CompanyListDto> getListOfCompany(){
    	List<CompanyList> companyLists = companyListRepository.findAll();
    	
    	return companyLists.stream()
    			.map(item-> new CompanyListDto(
    					item.getId(), 
    					item.getCompanyName(),
    					item.getTickerSymbol(), 
    					item.getShareToken().divide(item.getTotalToken()).multiply(BigDecimal.valueOf(100)), 
    					item.getCreatedAt())).toList();
    }
    
    @Override
public List<AggregatedCoinHistoryDto> getListOfValueHistory(String range) {
    LocalDateTime startDate = null;
    List<Object[]> rawData;

    switch (range.toLowerCase()) {
        case "1m" -> {
            startDate = LocalDateTime.now().minusMonths(1);
            rawData = coinsValueHistoryRepository.aggregateDaily(startDate);
        }
        case "2m" -> {
            startDate = LocalDateTime.now().minusMonths(2);
            rawData = coinsValueHistoryRepository.aggregateDaily(startDate);
        }
        case "6m" -> {
            startDate = LocalDateTime.now().minusMonths(6);
            rawData = coinsValueHistoryRepository.aggregateWeekly(startDate);
        }
        case "1y" -> {
            startDate = LocalDateTime.now().minusYears(1);
            rawData = coinsValueHistoryRepository.aggregateWeekly(startDate);
        }
        case "all" -> {
            rawData = coinsValueHistoryRepository.findAllDetailedLimited();
        }
        default -> {
            startDate = LocalDateTime.now().minusMonths(1);
            rawData = coinsValueHistoryRepository.aggregateDaily(startDate);
        }
    }

    return rawData.stream()
            .map(this::mapToDto)
            .toList();
}

private AggregatedCoinHistoryDto mapToDto(Object[] row) {
    LocalDate periodDate = ((java.sql.Date) row[0]).toLocalDate();

    Double avg = row[1] != null ? ((BigDecimal) row[1]).doubleValue() : null;
    Double min = row[2] != null ? ((BigDecimal) row[2]).doubleValue() : null;
    Double max = row[3] != null ? ((BigDecimal) row[3]).doubleValue() : null;

    return new AggregatedCoinHistoryDto(periodDate.atStartOfDay(), avg, min, max);
}


    @Override
    @Transactional // ✅ ensures both saves succeed or rollback together
    public boolean addNewCompanyShares(
            String companyName,
            String tickerSymbol,
            BigDecimal sharePrice,
            BigDecimal shareToken,
            BigDecimal totalToken
    ) {
    	
        // 1. Fetch latest coin value
        CoinsValueHistory recentCoinValue = coinsValueHistoryRepository.findTopByOrderByIdDesc();
        if (recentCoinValue == null) {
            throw new IllegalStateException("No coin value history found!");
        }

        // 2. Calculate TimeCoins
        BigDecimal timeCoins = sharePrice.multiply(shareToken)
                .divide(recentCoinValue.getValueInRupees(), 6, RoundingMode.HALF_UP);

        // 3. Build company entity
        CompanyList companyList = CompanyList.builder()
                .companyName(companyName)
                .tickerSymbol(tickerSymbol)
                .sharePrice(sharePrice)
                .shareToken(shareToken)
                .totalToken(totalToken)
                .timeCoins(timeCoins)
                .build();

        // 4. Always update TotalTimeCoins row with id=1
        TotalTimeCoins totalTimeCoins = totalTimeCoinsRepository.findById(1L)
                .orElseThrow(() -> new IllegalStateException("TotalTimeCoins row id=1 not found!"));
        totalTimeCoins.setTimecoins(totalTimeCoins.getTimecoins().add(timeCoins));

        // 5. Save both
        companyListRepository.save(companyList);
        totalTimeCoinsRepository.save(totalTimeCoins);

        return true;
    }
    
    /**
     * Runs every 1 hour, adds new row to coins_value_history
     */
    @Scheduled(fixedRate = 60 * 60 * 1000) // every 1 hour
    public void addCoinsValueHistory() {
    	BigDecimal newValue = calculateNewCoinValue();

        CoinsValueHistory history = CoinsValueHistory.builder()
        		.valueInRupees(newValue)
        		.build();

        coinsValueHistoryRepository.save(history);
        System.out.println("✅ New coin value added: " + newValue);
    }

    private BigDecimal calculateNewCoinValue() {
    	BigDecimal avg = companyListRepository.calculateAverageCoinValue();
        if (avg == null) {
            return new BigDecimal("1.00"); // default if no companies
        }
        return avg.setScale(6, RoundingMode.HALF_UP);
    }
}
