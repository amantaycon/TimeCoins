package com.timecoins.service;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;

import com.timecoins.dto.UserTransactionDto;

public interface DataHandleServicesIn {
	public String updateCoin(BigDecimal Coins, Long id);
	public Page<UserTransactionDto> getListOfTransation(Long id, int page, int size);
	public String processTransfer(UserTransactionDto transactionDetail);
}
