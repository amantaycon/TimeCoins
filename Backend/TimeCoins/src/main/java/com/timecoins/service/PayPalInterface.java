package com.timecoins.service;

import java.io.IOException;

import com.timecoins.dto.WalletTransactionDto;

public interface PayPalInterface {
	public String createOrder(double usdAmount, Long userId) throws IOException;
	public WalletTransactionDto captureOrder(String orderId, Long userId) throws IOException;
}
