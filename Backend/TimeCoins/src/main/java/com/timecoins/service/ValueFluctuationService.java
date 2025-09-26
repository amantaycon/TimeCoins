package com.timecoins.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.timecoins.dto.AggregatedCoinHistoryDto;
import com.timecoins.dto.CompanyListDto;
import com.timecoins.model.CoinsValueHistory;
import com.timecoins.model.CompanyList;
import com.timecoins.model.TotalTimeCoins;
import com.timecoins.model.WebUsers;
import com.timecoins.repository.CoinsValueHistoryRepository;
import com.timecoins.repository.CompanyListRepository;
import com.timecoins.repository.TotalTimeCoinsRepository;
import com.timecoins.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ValueFluctuationService implements ValueFluctuationServiceIn {

    private final CompanyListRepository companyListRepository;
    private final CoinsValueHistoryRepository coinsValueHistoryRepository;
    private final TotalTimeCoinsRepository totalTimeCoinsRepository;
    private final UserRepository userRepository;
    
    @Override
    public CompanyListDto addCompany(CompanyListDto companyDetails, Long userId) {
    	
    	WebUsers user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!Boolean.TRUE.equals(user.getAdmin())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not authorized to send from this account.");
        }
    	
     // 🔍 Validate required fields
        if (companyDetails.getCompanyName() == null || companyDetails.getCompanyName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company name is required");
        }
        if (companyDetails.getTickerSymbol() == null || companyDetails.getTickerSymbol().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ticker symbol is required");
        }
        if (companyDetails.getSharePrice() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Share price is required");
        }
        if (companyDetails.getShareToken() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Share token is required");
        }
        if (companyDetails.getTotalToken() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total token is required");
        }
        if (companyDetails.getEmail() == null || companyDetails.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (companyDetails.getWebsite() == null || companyDetails.getWebsite().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Website is required");
        }
        
    	// 1. Fetch latest coin value
    	CoinsValueHistory recentCoinValue = coinsValueHistoryRepository.findTopByOrderByIdDesc();
        if (recentCoinValue == null) {
            throw new IllegalStateException("No coin value history found!");
        }
        
        // 2. Calculate TimeCoins
        BigDecimal timeCoins = companyDetails.getSharePrice().multiply(companyDetails.getShareToken())
                .divide(recentCoinValue.getValueInRupees(), 6, RoundingMode.HALF_UP);
        
        // 3. Build company entity and save in database
    	CompanyList company = companyListRepository.save(CompanyList.builder()
    			.companyName(companyDetails.getCompanyName())
    			.tickerSymbol(companyDetails.getTickerSymbol())
    			.sharePrice(companyDetails.getSharePrice())
    			.shareToken(companyDetails.getShareToken())
    			.totalToken(companyDetails.getTotalToken())
    			.timeCoins(timeCoins)
    			.email(companyDetails.getEmail())
    			.website(companyDetails.getWebsite())
    			.approve(false)
    			.build()
    	);
    	
    	// 4. Return DTO
        return CompanyListDto.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .tickerSymbol(company.getTickerSymbol())
                .sharesPercentage(
                        company.getShareToken()
                               .divide(company.getTotalToken(), 6, RoundingMode.HALF_UP)
                               .multiply(BigDecimal.valueOf(100))
                )
                .totalValueInTimecoins(company.getTimeCoins())
                .createAt(company.getCreatedAt())
                .approve(company.getApprove())
                .email(company.getEmail())
                .website(company.getWebsite())
                .build();
    }
    
    @Override
    public BigDecimal getCoinValueInRuppees() {
    	CoinsValueHistory value = coinsValueHistoryRepository.findTopByOrderByIdDesc();
    	return value.getValueInRupees();
    }
    
    @Override
    public List<CompanyListDto> getListOfCompany(){
    	List<CompanyList> companyLists = companyListRepository.findAll();
    	
    	return companyLists.stream()
    			.map(item-> CompanyListDto.builder()
    					.id(item.getId())
    					.companyName(item.getCompanyName())
    					.tickerSymbol(item.getTickerSymbol())
    					.sharesPercentage(
    	                        item.getShareToken()
    	                               .divide(item.getTotalToken(), 6, RoundingMode.HALF_UP)
    	                               .multiply(BigDecimal.valueOf(100))
    	                )
    					.totalValueInTimecoins(item.getTimeCoins())
    					.createAt(item.getCreatedAt())
    					.approve(item.getApprove())
    					.email(item.getEmail())
    					.website(item.getWebsite())
    					.build()).toList();
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
	@Transactional // ensures rollback if anything fails
	public boolean approveCompany(Long id, Long userId) {

	    // 1. Validate user
	    WebUsers user = userRepository.findById(userId)
	            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

	    if (!Boolean.TRUE.equals(user.getAdmin())) {
	        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
	                "You are not authorized to send from this account.");
	    }

	    // 2. Find company
	    CompanyList companyList = companyListRepository.findById(id)
	            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));

	    if (companyList.getApprove()) {
	        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
	                "Company is already approved");
	    }

	    // 3. Ensure TotalTimeCoins row exists (id=1)
	    TotalTimeCoins totalTimeCoins = totalTimeCoinsRepository.findById(1L)
	            .orElseGet(() -> {
	                // create and save if not found
	                TotalTimeCoins newTotal = new TotalTimeCoins();
	                newTotal.setId(1L); // explicitly set ID = 1
	                newTotal.setTimecoins(BigDecimal.ZERO);
	                return totalTimeCoinsRepository.save(newTotal);
	            });

	    // 4. Update total timecoins and company approval
	    totalTimeCoins.setTimecoins(totalTimeCoins.getTimecoins().add(companyList.getTimeCoins()));
	    companyList.setApprove(true);

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
