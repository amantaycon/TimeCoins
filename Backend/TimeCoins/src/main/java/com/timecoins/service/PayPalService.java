package com.timecoins.service;

import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import com.timecoins.dto.WalletTransactionDto;
import com.timecoins.model.*;
import com.timecoins.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class PayPalService implements PayPalInterface {

    private final PayPalHttpClient payPalClient;
    private final WalletTransactionRepository walletTransactionRepository;
    private final UserRepository userRepository;
    private final CoinsValueHistoryRepository coinsValueHistoryRepository;
    private final TotalTimeCoinsRepository totalTimeCoinsRepository;

    // 🟢 Create PayPal Order
    @Override
    public String createOrder(double usdAmount, Long userId) throws IOException {
        if (usdAmount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0.");
        }

        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // ✅ PayPal Order Details
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.checkoutPaymentIntent("CAPTURE");

        PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest()
                .amountWithBreakdown(new AmountWithBreakdown()
                        .currencyCode("USD")
                        .value(String.format("%.2f", usdAmount)));

        orderRequest.purchaseUnits(Collections.singletonList(purchaseUnit));

        // ✅ MOST IMPORTANT ✅ Add Return + Cancel URL
        ApplicationContext applicationContext = new ApplicationContext()
                .returnUrl("http://localhost:5173/payment-success")
                .cancelUrl("http://localhost:5173/payment-cancel");

        orderRequest.applicationContext(applicationContext);

        // ✅ Create Order API call
        OrdersCreateRequest request = new OrdersCreateRequest()
                .requestBody(orderRequest);

        HttpResponse<Order> response = payPalClient.execute(request);

        System.out.println("✅ PayPal Order Created, ID: " + response.result().id());

        return response.result().id();
    }


    @Transactional
    @Override
    public WalletTransactionDto captureOrder(String orderId, Long userId) throws IOException {
        // Prepare response variables
        WalletTransaction walletTx = null;
        WebUsers user = null;
        BigDecimal usdValue = BigDecimal.ZERO;
        BigDecimal timeCoinsAmount = BigDecimal.ZERO;

        try {
            // 🔹 Capture PayPal order
            OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
            request.requestBody(new OrderRequest());
            HttpResponse<Order> response = payPalClient.execute(request);
            Order order = response.result();

            if (!"COMPLETED".equalsIgnoreCase(order.status())) {
                throw new RuntimeException("Payment not completed. Status: " + order.status());
            }

            // 🔹 Get user
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            // 🔹 Extract USD value
            String usdValueStr = order.purchaseUnits().get(0).payments().captures().get(0).amount().value();
            usdValue = new BigDecimal(usdValueStr);

            // 🔹 Convert USD → INR
            BigDecimal inrValue = usdValue.multiply(BigDecimal.valueOf(88.78));

            // 🔹 Get latest coin value
            CoinsValueHistory latestCoinValue = coinsValueHistoryRepository.findTopByOrderByIdDesc();
            if (latestCoinValue == null || latestCoinValue.getValueInRupees() == null) {
                throw new RuntimeException("Coin value history not found.");
            }

            // 🔹 Convert INR → TimeCoins
            timeCoinsAmount = inrValue.divide(latestCoinValue.getValueInRupees(), 4, RoundingMode.HALF_UP);

            // 🔹 Check system supply
            TotalTimeCoins totalCoins = totalTimeCoinsRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("Total TimeCoins record not found."));

            if (totalCoins.getTimecoins().compareTo(timeCoinsAmount) < 0) {
                throw new RuntimeException("Insufficient TimeCoins supply in system.");
            }

            // 🔹 Update user's wallet balance
            user.setWalletBalance(user.getWalletBalance().add(timeCoinsAmount));
            userRepository.save(user);

            // 🔹 Deduct from total supply
            totalCoins.setTimecoins(totalCoins.getTimecoins().subtract(timeCoinsAmount));
            totalTimeCoinsRepository.save(totalCoins);

            // 🔹 Save successful wallet transaction
            walletTx = WalletTransaction.builder()
                    .receiver(user)
                    .timeCoins(timeCoinsAmount)
                    .localCoin(usdValue)
                    .localCurrency("USD")
                    .localTransactionId(orderId)
                    .transactionType(TransactionType.DEPOSIT)
                    .description("Added TimeCoins via PayPal successfully.")
                    .transactionDate(LocalDateTime.now())
                    .build();

            walletTransactionRepository.save(walletTx);

        } catch (Exception e) {
            // ⚠️ Handle any failure and ensure transaction is still recorded
            if (user == null) {
                // If user not found or null, we can’t save wallet transaction safely
                throw new RuntimeException("Transaction failed before user retrieval: " + e.getMessage());
            }

            try {
                // 🔹 Record failed transaction (for refund tracking)
                walletTx = WalletTransaction.builder()
                        .receiver(user)
                        .timeCoins(timeCoinsAmount)
                        .localCoin(usdValue)
                        .localCurrency("USD")
                        .localTransactionId(orderId)
                        .transactionType(TransactionType.FAILED)
                        .description("Payment succeeded on PayPal, but failed to add TimeCoins: " + e.getMessage())
                        .transactionDate(LocalDateTime.now())
                        .build();

                walletTransactionRepository.save(walletTx);

            } catch (Exception logEx) {
                // ⚠️ If even logging fails, print but don’t rethrow (avoid masking main issue)
                System.err.println("Failed to record failed transaction: " + logEx.getMessage());
            }

            // 🔹 Rethrow original exception so controller can handle refund logic
            throw new RuntimeException("Transaction failed: " + e.getMessage(), e);
        }

        // 🔹 Return DTO (either successful or failed)
        return WalletTransactionDto.builder()
                .transactionId(walletTx.getId())
                .localTransationId(walletTx.getLocalTransactionId())
                .username(user.getUsername())
                .timecoins(walletTx.getTimeCoins())
                .localAmount(walletTx.getLocalCoin())
                .localCurrency(walletTx.getLocalCurrency())
                .transactionType(walletTx.getTransactionType())
                .description(walletTx.getDescription())
                .transactionDate(walletTx.getTransactionDate())
                .build();
    }

}
