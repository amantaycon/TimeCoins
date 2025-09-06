package com.timecoins.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.timecoins.model.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTransactionDto {
    private Long id;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDateTime transactionDate;
    private String description;
    private Long senderId;
    private Long receiverId;
    private String senderUsername;
    private String receiverUsername;
}
