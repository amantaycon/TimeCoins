package com.timecoins.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String resetToken;

    private Boolean isVerified;

    private LocalDateTime createdAt;

    @Column(precision = 19, scale = 4)
    private BigDecimal walletBalance;

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private List<UserTransaction> sentTransactions;

    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY)
    private List<UserTransaction> receivedTransactions;


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.walletBalance = BigDecimal.ZERO;
        this.isVerified = false;
    }
}
