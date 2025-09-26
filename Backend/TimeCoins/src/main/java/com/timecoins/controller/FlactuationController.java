package com.timecoins.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timecoins.dto.AggregatedCoinHistoryDto;
import com.timecoins.dto.CompanyListDto;
import com.timecoins.service.CustomUserDetails;
import com.timecoins.service.ValueFluctuationServiceIn;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/value")
@RequiredArgsConstructor
public class FlactuationController {
	
	final private ValueFluctuationServiceIn valueFluctuationServiceIn;

	@GetMapping("/history")
	public List<AggregatedCoinHistoryDto> getValueHistory(@RequestParam(defaultValue = "1m") String range){
		return valueFluctuationServiceIn.getListOfValueHistory(range);
	}
	
	@GetMapping("/company/list")
	public List<CompanyListDto> getcompanyList(){
		return valueFluctuationServiceIn.getListOfCompany();
	}
	
	@GetMapping("/inrupees")
	public BigDecimal getValueInRuppes() {
		return valueFluctuationServiceIn.getCoinValueInRuppees();
	}
	
	@PostMapping("/company/add")
	public CompanyListDto addCompany(
			@RequestBody CompanyListDto companyDetails, 
			Authentication authentication
			){
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    Long userId = userDetails.getId();
	    
		return valueFluctuationServiceIn.addCompany(companyDetails, userId);
	}
	
	@PutMapping("/company/approve/{id}")
	public Boolean approveCompany(
			@PathVariable Long id,
			Authentication authentication
			) {
		
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    Long userId = userDetails.getId();
	    
		return valueFluctuationServiceIn.approveCompany(id, userId);
	}
	
	@PostMapping("/company/vote/{id}/{vote}")
	public Boolean voteToCompany(
			@PathVariable Long id,
			@PathVariable String vote,
			Authentication authentication
			) {
		
		return false;
	}
	
}
