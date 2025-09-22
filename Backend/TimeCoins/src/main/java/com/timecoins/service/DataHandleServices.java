package com.timecoins.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.timecoins.dto.MessageTemplate;
import com.timecoins.dto.UserTransactionDto;
import com.timecoins.model.MessageHistory;
import com.timecoins.model.TransactionType;
import com.timecoins.model.TypeContent;
import com.timecoins.model.UserTransaction;
import com.timecoins.model.WebUsers;
import com.timecoins.repository.MessageHistoryRepository;
import com.timecoins.repository.UserRepository;
import com.timecoins.repository.UserTransactionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DataHandleServices implements DataHandleServicesIn {

    private final UserRepository userRepository;
    private final UserTransactionRepository userTransactionRepository;
    private final PasswordEncoder encoder;
    private final MessageHistoryRepository messageHistoryRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public String updateCoin(BigDecimal coins, Long id) {
        WebUsers webUser = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        webUser.setWalletBalance(webUser.getWalletBalance().add(coins));
        userRepository.save(webUser);

        return "Wallet updated successfully for user " + id;
    }

    @Override
    @Transactional
    public String processTransfer(UserTransactionDto transactionDetail) {
        Long senderId = transactionDetail.getSenderId();
        Long receiverId = transactionDetail.getReceiverId();
        BigDecimal amount = transactionDetail.getAmount();

        WebUsers sender = null;
        WebUsers receiver = null;

        try {
            // ✅ Fetch sender
            sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));

            // ✅ Fetch receiver
            receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver not found"));

            if (!encoder.matches(transactionDetail.getDescription(), sender.getPassword()))
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
            
            
            // ✅ Check balance
            if (sender.getWalletBalance().compareTo(amount) < 0) {
                // Record failed transaction
                saveTransaction(sender, receiver, amount, TransactionType.FAILED, "Insufficient balance");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance");
            }

            // ✅ Perform transfer
            sender.setWalletBalance(sender.getWalletBalance().subtract(amount));
            receiver.setWalletBalance(receiver.getWalletBalance().add(amount));

            userRepository.save(sender);
            userRepository.save(receiver);

            // ✅ Record success
            saveTransaction(sender, receiver, amount, TransactionType.TRANSFER, "Transfer successful");

            return "Transfer of " + amount + " TimeCoins from User " + senderId + " to User " + receiverId + " successful.";

        } catch (ResponseStatusException e) {
            // Already recorded failed reason, just propagate
            throw e;
        } catch (Exception e) {
            // Any other unexpected failure
            saveTransaction(sender, receiver, amount, TransactionType.FAILED, "Unexpected error: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Transaction failed");
        }
    }

 // Helper method with builder
    private void saveTransaction(WebUsers sender, WebUsers receiver, BigDecimal amount, TransactionType type, String remark) {
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

            // Update delivery status
            savedHistory.setDelivered(true);
            messageHistoryRepository.save(savedHistory);
        } catch (Exception e) {
            // If user not connected → message stays only in DB
        }
    }



    @Override
    public Page<UserTransactionDto> getListOfTransation(Long id, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDate").descending());

        Page<UserTransaction> transactions =
                userTransactionRepository.findBySenderIdOrReceiverId(id, id, pageable);

        return transactions.map(tx -> UserTransactionDto.builder()
                .id(tx.getId())
                .senderId(tx.getSender() != null ? tx.getSender().getId() : null)
                .receiverId(tx.getReceiver() != null ? tx.getReceiver().getId() : null)
                .senderUsername(tx.getSender().getUsername())
                .receiverUsername(tx.getReceiver().getUsername())
                .amount(tx.getTimecoins())
                .type(tx.getTransactionType())
                .transactionDate(tx.getTransactionDate())
                .description(tx.getDescription())
                .build()
        );
    }

}
