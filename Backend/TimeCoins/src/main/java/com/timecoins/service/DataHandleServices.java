package com.timecoins.service;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.timecoins.dto.UserTransactionDto;
import com.timecoins.dto.WalletTransactionDto;
import com.timecoins.model.TransactionType;
import com.timecoins.model.UserTransaction;
import com.timecoins.model.WalletTransaction;
import com.timecoins.model.WebUsers;
import com.timecoins.repository.UserRepository;
import com.timecoins.repository.UserTransactionRepository;
import com.timecoins.repository.WalletTransactionRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DataHandleServices implements DataHandleServicesIn {

    private final UserRepository userRepository;
    private final UserTransactionRepository userTransactionRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final PasswordEncoder encoder;
    private final TransactionLogService transactionLogService;

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
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Incorrect password");
            
            
            // ✅ Check balance
            if (sender.getWalletBalance().compareTo(amount) < 0) {
                // Record failed transaction
            	transactionLogService.saveTransaction(sender, receiver, amount, TransactionType.FAILED, "Insufficient balance");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance");
            }

            // ✅ Perform transfer
            sender.setWalletBalance(sender.getWalletBalance().subtract(amount));
            receiver.setWalletBalance(receiver.getWalletBalance().add(amount));

            userRepository.save(sender);
            userRepository.save(receiver);

            // ✅ Record success
            transactionLogService.saveTransaction(sender, receiver, amount, TransactionType.TRANSFER, "Transfer successful");

            return "Transfer of " + amount + " TimeCoins from User " + senderId + " to User " + receiverId + " successful.";

        } catch (ResponseStatusException e) {
            // Already recorded failed reason, just propagate
            throw e;
        } catch (Exception e) {
            // Any other unexpected failure
        	transactionLogService.saveTransaction(sender, receiver, amount, TransactionType.FAILED, "Unexpected error: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Transaction failed");
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
    
    @Override
    public Page<WalletTransactionDto> getListOfTransactionOutsideMoney(Long id, int page, int size){
    	Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDate").descending());
    	Page<WalletTransaction> outsideTransation = 
    			walletTransactionRepository.findByReceiverId(id, pageable);
    	return outsideTransation.map(tx-> WalletTransactionDto.builder()
    			.transactionId(tx.getId())
    			.localTransationId(tx.getLocalTransactionId())
    			.timecoins(tx.getTimeCoins())
    			.localAmount(tx.getLocalCoin())
    			.localCurrency(tx.getLocalCurrency())
    			.transactionType(tx.getTransactionType())
    			.description(tx.getDescription())
    			.transactionDate(tx.getTransactionDate())
    			.build()
    			);
    }

}
