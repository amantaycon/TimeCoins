package com.timecoins.controller;

import com.timecoins.dto.PaymentRequest;
import com.timecoins.dto.WalletTransactionDto;
import com.timecoins.service.CustomUserDetails;
import com.timecoins.service.PayPalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
@RequiredArgsConstructor
public class PayPalController {

    private final PayPalService payPalService;

    // 🟢 Create PayPal Order
    @PostMapping(value = "/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest paymentRequest, Authentication authentication) {
        try {
            // --- 1) Validate request ---
            if (paymentRequest == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing request body."));
            }
            double amount = paymentRequest.getAmount();
            if (amount <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0."));
            }

            // --- 2) Validate authentication safely ---
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
            }
            Object principal = authentication.getPrincipal();
            if (!(principal instanceof CustomUserDetails)) {
                return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
            }

            CustomUserDetails customUserDetails = (CustomUserDetails) principal;
            Long userId = customUserDetails.getId();

            // --- 3) Call service to create PayPal order ---
            String orderId = payPalService.createOrder(amount, userId);

            if (orderId == null || orderId.isBlank()) {
                // service returned nothing — log and return 500
                return ResponseEntity.internalServerError().body(Map.of("error", "Failed to create order"));
            }

            // --- 4) Success ---
            return ResponseEntity.ok(Map.of("orderId", orderId));

        } catch (IOException e) {
            // expected IO errors when talking to PayPal
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error creating PayPal order: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Unexpected error: " + e.getMessage()));
        }
    }

    // 🟢 Capture PayPal Order and Add Wallet Transaction
    @PostMapping("/capture-order")
    public ResponseEntity<?> captureOrder(@RequestBody Map<String, String> body, Authentication authentication) {

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = customUserDetails.getId();

        try {
            if (!body.containsKey("orderId") || body.get("orderId") == null || body.get("orderId").isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing orderId in request body."));
            }

            String orderId = body.get("orderId");
            WalletTransactionDto transaction = payPalService.captureOrder(orderId, userId);

            return ResponseEntity.ok(transaction);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error capturing PayPal order: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Unexpected error: " + e.getMessage()));
        }
    }


}
