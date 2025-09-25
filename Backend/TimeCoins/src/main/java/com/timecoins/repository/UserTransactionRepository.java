package com.timecoins.repository;

import java.util.List;

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
	
	@Query("SELECT t FROM UserTransaction t " +
	           "WHERE t.receiver.id = :receiverId " +
	           "AND t.transactionType IN (:types)")
	    Page<UserTransaction> findByReceiverIdAndTransactionTypes(@Param("receiverId") Long receiverId,
	                                                              @Param("types") List<TransactionType> types,
	                                                              Pageable pageable);

}
