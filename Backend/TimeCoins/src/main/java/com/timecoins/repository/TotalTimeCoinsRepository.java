package com.timecoins.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timecoins.model.TotalTimeCoins;

public interface TotalTimeCoinsRepository extends JpaRepository<TotalTimeCoins, Long> {
	
}
