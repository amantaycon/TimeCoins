package com.timecoins.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.timecoins.model.TransactionType;
import com.timecoins.model.UserTransaction;

public interface UserTransactionRepository extends JpaRepository<UserTransaction, Long> {
	Page<UserTransaction> findBySenderIdOrReceiverId(Long senderId, Long receiverId, Pageable pageable);
	
	@Query("SELECT COUNT(t) FROM UserTransaction t " +
		       "WHERE t.transactionType = :type " +
		       "AND (t.sender.id = :userId OR t.receiver.id = :userId)")
		Long countTransfersByUserId(@Param("userId") Long userId,
		                            @Param("type") TransactionType type);

}
