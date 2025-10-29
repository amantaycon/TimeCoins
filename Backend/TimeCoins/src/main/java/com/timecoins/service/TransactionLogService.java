package com.timecoins.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.timecoins.dto.MessageTemplate;
import com.timecoins.model.MessageHistory;
import com.timecoins.model.TransactionType;
import com.timecoins.model.TypeContent;
import com.timecoins.model.UserTransaction;
import com.timecoins.model.WebUsers;
import com.timecoins.repository.MessageHistoryRepository;
import com.timecoins.repository.UserTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionLogService {
	
    private final UserTransactionRepository userTransactionRepository;
    private final MessageHistoryRepository messageHistoryRepository;
    private final SimpMessagingTemplate messagingTemplate;

	@Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveTransaction(WebUsers sender, WebUsers receiver, BigDecimal amount, TransactionType type, String remark) {
        LocalDateTime now = LocalDateTime.now();

        // Save transaction
        UserTransaction tx = UserTransaction.builder()
                .sender(sender)
                .receiver(receiver)
                .timecoins(amount)
                .transactionType(type)
                .transactionDate(now)
                .description(remark)
                .build();

        userTransactionRepository.save(tx);

        // Save message in history (delivered = false by default)
        MessageHistory savedHistory = messageHistoryRepository.save(
            MessageHistory.builder()
                .senderId(sender.getId())
                .receiverId(receiver.getId())
                .content(remark + " --- " + amount)
                .typeContent(TypeContent.Money)
                .timestamp(now)
                .isRead(false)
                .isDelivered(false)
                .build()
        );

        // Build DTO
        MessageTemplate dto = MessageTemplate.builder()
                .id(savedHistory.getId())
                .senderId(savedHistory.getSenderId())
                .receiverId(savedHistory.getReceiverId())
                .content(savedHistory.getContent())
                .type(savedHistory.getTypeContent())
                .timestamp(savedHistory.getTimestamp())
                .isRead(savedHistory.isRead())
                .isDelivered(false)
                .build();

        // ✅ Try sending live if user online
        try {
            messagingTemplate.convertAndSendToUser(
                    dto.getReceiverId().toString(),
                    "/queue/messages",
                    dto
            );
            
            messagingTemplate.convertAndSendToUser(
            		dto.getSenderId().toString(),
            		"/queue/messages",
            		dto
            		);

            // Update delivery status
            savedHistory.setDelivered(true);
            messageHistoryRepository.save(savedHistory);
        } catch (Exception e) {
            // If user not connected → message stays only in DB
        }
    }
}
