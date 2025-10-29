package com.timecoins.dto;

import com.timecoins.model.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class WalletTransactionDto {
    private Long transactionId;
    private String localTransationId;
    private String username;
    private BigDecimal timecoins;
    private BigDecimal localAmount;
    private String localCurrency;
    private TransactionType transactionType;
    private String description;
    private LocalDateTime transactionDate;
}
