package com.timecoins.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.timecoins.dto.ChatUserSummary;
import com.timecoins.dto.GetCoins;
import com.timecoins.dto.MessageTemplate;
import com.timecoins.dto.UserTransactionDto;
import com.timecoins.service.CustomUserDetails;
import com.timecoins.service.DataHandleServicesIn;
import com.timecoins.service.MessageServiceIn;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HomeController {
	
	private final MessageServiceIn messageServiceIn;
	private final DataHandleServicesIn dataHandleServicesIn;
	
	@PostMapping("/u/process/transaction")
	public ResponseEntity<String> processTransaction(
	        @RequestBody UserTransactionDto transactionDetails,
	        Authentication authentication) {

	    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    Long userId = userDetails.getId();

	    // ✅ Only the logged-in user can be the sender
	    if (!userId.equals(transactionDetails.getSenderId())) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN)
	                .body("You are not authorized to send from this account.");
	    }

	    // ✅ Amount must be > 0
	    if (transactionDetails.getAmount() == null
	            || transactionDetails.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
	        return ResponseEntity.badRequest()
	                .body("Transaction amount must be greater than zero.");
	    }

	    // ✅ Type must be present
	    if (transactionDetails.getType() == null) {
	        return ResponseEntity.badRequest().body("Transaction type is required.");
	    }
	    
	    if (transactionDetails.getDescription() == null) {
	    	 return ResponseEntity.badRequest().body("Password is required for transaction");
	    }

	    try {
	        switch (transactionDetails.getType()) {
	            case TRANSFER -> {
	                if (transactionDetails.getReceiverId() == null) {
	                    return ResponseEntity.badRequest().body("Receiver ID is required for transfers.");
	                }
	                if (transactionDetails.getSenderId().equals(transactionDetails.getReceiverId())) {
	                    return ResponseEntity.badRequest().body("Cannot transfer to the same account.");
	                }

	                System.out.println(
	                dataHandleServicesIn.processTransfer(transactionDetails)
	                );
	                return ResponseEntity.ok("Transfer successful.");
	            }
//	            case DEPOSIT, WITHDRAW -> {
//	                dataHandleServicesIn.doneTransaction(transactionDetails);
//	                return ResponseEntity.ok("Transaction processed successfully.");
//	            }
	            default -> {
	                return ResponseEntity.badRequest().body("Unsupported transaction type.");
	            }
	        }
	    } catch (ResponseStatusException ex) {
	        // Spring will automatically map this to proper HTTP status
	        return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
	    } catch (Exception ex) {
	        // Unexpected error
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Transaction failed due to internal error.");
	    }
	}

	@PostMapping("/u/process/transaction_list")
	public Page<UserTransactionDto> getListOfTransaction(
			@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication){
		
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    Long userId = userDetails.getId();
		
		return dataHandleServicesIn.getListOfTransation(userId, page, size);
	}
	
	@PostMapping("/u/message/push")
	public MessageTemplate pushMessage(@RequestBody MessageTemplate message,
			Authentication authentication) {
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    Long userId = userDetails.getId();
		
		return messageServiceIn.pushMessage(message, userId);
	}

	
	@PostMapping("/u/message/history")
	public Page<MessageTemplate> getMessageHistory(
			@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam Long id,
            Authentication authentication
			){
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    Long userId = userDetails.getId();
		
		return messageServiceIn.getChatMessages(id, userId, page, size);
	}
	
	@PostMapping("/u/search/user")
	public List<ChatUserSummary> getSerchedUser(@RequestParam String search){
		if(search.isEmpty()) return null;
		return messageServiceIn.getSearchedUsers(search);
	}
	
	@PostMapping("/u/message/listpanel")
	public ResponseEntity<Page<ChatUserSummary>> getChatUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
		
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	    Long userId = userDetails.getId();
	    return ResponseEntity.ok(messageServiceIn.getChatUsersWithUnread(userId, page, size));
	}
	
	@PostMapping("/u/balance")
	public GetCoins getBalance(Authentication authentication) {
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		return new GetCoins(userDetails.getWalletBalance());
	}
	
	@PostMapping("/u/update_balance")
	public String updateBalance(@RequestBody GetCoins coin,Authentication authentication) {
		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		return dataHandleServicesIn.updateCoin(coin.getCoin(), userDetails.getId());
	}
	
}
