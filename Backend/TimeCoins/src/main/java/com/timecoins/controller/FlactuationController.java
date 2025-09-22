package com.timecoins.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timecoins.dto.AggregatedCoinHistoryDto;
import com.timecoins.dto.CompanyListDto;
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
	
	
	
}
