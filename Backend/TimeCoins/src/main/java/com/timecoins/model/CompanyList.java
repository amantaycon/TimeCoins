package com.timecoins.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class CompanyList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Company details
    private String companyName;
    private String tickerSymbol; // e.g., TCS, INFY

    // Financial details
    private BigDecimal sharePrice;   // Current price of one percentage share in Rupees
    private BigDecimal shareToken;   // Percentage weight in TimeCoins
    private BigDecimal totalToken;
    private BigDecimal timeCoins;    // Current TimeCoins value mapped to this company
    private Boolean approve;
    private String email;
    private String website;

    private LocalDateTime createdAt;

    // 🔗 One-to-Many mapping to votes
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CompanyVote> votes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
