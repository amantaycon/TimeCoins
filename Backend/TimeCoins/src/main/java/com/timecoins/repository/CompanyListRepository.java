package com.timecoins.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.timecoins.model.CompanyList;

public interface CompanyListRepository extends JpaRepository<CompanyList, Long> {
	@Query(value = "SELECT AVG((share_price * share_token) / time_coins) FROM company_list", nativeQuery = true)
    BigDecimal calculateAverageCoinValue();
}
