package com.timecoins.model;

public enum TransactionType {
	DEPOSIT,
    WITHDRAWAL,
    TRANSFER,
    FAILED,     // 🚨 for failed transactions
    CANCELLED
}
