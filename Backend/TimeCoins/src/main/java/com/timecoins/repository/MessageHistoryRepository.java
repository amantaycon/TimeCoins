package com.timecoins.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.timecoins.model.MessageHistory;

public interface MessageHistoryRepository extends JpaRepository<MessageHistory, Long> {

	@Query("""
	        SELECT m FROM MessageHistory m
	        WHERE (m.senderId = :user1 AND m.receiverId = :user2)
	           OR (m.senderId = :user2 AND m.receiverId = :user1)
	        ORDER BY m.timestamp ASC
	    """)
	    Page<MessageHistory> findConversation(@Param("user1") Long user1,
	                                          @Param("user2") Long user2,
	                                          Pageable pageable);

    List<MessageHistory> findByReceiverIdAndIsReadFalse(Long receiverId);

    @Query(value = """
    	    SELECT u.id AS userId, u.username, u.full_name,
    	           CASE 
    	               WHEN lastMsg.receiver_id = :userId AND lastMsg.is_read = false THEN false
    	               ELSE true
    	           END AS hasSeen
    	    FROM web_users u
    	    JOIN (
    	        SELECT 
    	            CASE 
    	                WHEN m.sender_id = :userId THEN m.receiver_id
    	                ELSE m.sender_id
    	            END AS chatPartnerId,
    	            MAX(m.timestamp) AS lastTimestamp
    	        FROM message_history m
    	        WHERE m.sender_id = :userId OR m.receiver_id = :userId
    	        GROUP BY chatPartnerId
    	    ) chatUsers ON u.id = chatUsers.chatPartnerId
    	    JOIN message_history lastMsg 
    	        ON ((lastMsg.sender_id = u.id AND lastMsg.receiver_id = :userId) 
    	         OR (lastMsg.sender_id = :userId AND lastMsg.receiver_id = u.id))
    	       AND lastMsg.timestamp = chatUsers.lastTimestamp
    	    ORDER BY chatUsers.lastTimestamp DESC
    	    """,
    	    countQuery = """
    	        SELECT COUNT(*) FROM (
    	            SELECT 
    	                CASE 
    	                    WHEN m.sender_id = :userId THEN m.receiver_id
    	                    ELSE m.sender_id
    	                END AS chatPartnerId
    	            FROM message_history m
    	            WHERE m.sender_id = :userId OR m.receiver_id = :userId
    	            GROUP BY chatPartnerId
    	        ) AS temp
    	    """,
    	    nativeQuery = true)
    	Page<Object[]> findChatUsersWithUnreadFlag(@Param("userId") Long userId, Pageable pageable);

    	@Transactional
    	@Modifying
    	@Query("""
    	    UPDATE MessageHistory m
    	    SET m.isRead = true
    	    WHERE m.id = :messageId AND m.receiverId = :userId
    	""")
    	int markMessageAsSeen(@Param("messageId") Long messageId, @Param("userId") Long userId);




}
