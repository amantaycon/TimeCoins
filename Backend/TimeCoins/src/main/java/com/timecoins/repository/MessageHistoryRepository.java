package com.timecoins.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
               COUNT(CASE WHEN m.receiver_id = :userId AND m.is_read = false THEN 1 END) AS unreadCount
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
        LEFT JOIN message_history m ON (m.sender_id = u.id AND m.receiver_id = :userId)
        GROUP BY u.id, u.username, u.full_name, chatUsers.lastTimestamp
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
    Page<Object[]> findChatUsersWithUnread(@Param("userId") Long userId, Pageable pageable);
}
