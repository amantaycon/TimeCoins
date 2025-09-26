package com.timecoins.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
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
    private BigDecimal sharePrice;  // Current price of one percentage share in Rupees
    private BigDecimal shareToken;  // Percentage weight in TimeCoins
    private BigDecimal totalToken;
    private BigDecimal timeCoins;    // Current TimeCoins value mapped to this company
    private Boolean approve;
    private String email;
    private String website;
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
	
}
