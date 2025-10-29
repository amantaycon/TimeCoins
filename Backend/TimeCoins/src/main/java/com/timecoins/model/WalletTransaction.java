package com.timecoins.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wallet_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Amount in TimeCoins
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal timeCoins;

    // Equivalent value in local coin
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal localCoin;

    // Local currency as string (e.g., "INR", "USD")
    @Column(nullable = false)
    private String localCurrency;

    // Reference to local transaction ID if applicable
    @Column(name = "local_transaction_id")
    private String localTransactionId;

    //for transaction type
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    // Description of the transaction
    private String description;

    // The receiver of the transaction (foreign key)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private WebUsers receiver;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime transactionDate;

    @PrePersist
    protected void onCreate() {
        if (transactionDate == null) {
            transactionDate = LocalDateTime.now();
        }
    }
}
