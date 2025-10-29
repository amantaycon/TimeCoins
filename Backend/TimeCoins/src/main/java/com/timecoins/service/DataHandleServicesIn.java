package com.timecoins.service;

import org.springframework.data.domain.Page;

import com.timecoins.dto.UserTransactionDto;
import com.timecoins.dto.WalletTransactionDto;

public interface DataHandleServicesIn {
	public Page<UserTransactionDto> getListOfTransation(Long id, int page, int size);
	public String processTransfer(UserTransactionDto transactionDetail);
	public Page<WalletTransactionDto> getListOfTransactionOutsideMoney(Long id, int page, int size);
}
