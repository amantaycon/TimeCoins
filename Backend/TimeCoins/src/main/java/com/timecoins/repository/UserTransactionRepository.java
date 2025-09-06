package com.timecoins.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.timecoins.model.UserTransaction;

public interface UserTransactionRepository extends JpaRepository<UserTransaction, Long> {
	Page<UserTransaction> findBySenderIdOrReceiverId(Long senderId, Long receiverId, Pageable pageable);
}
