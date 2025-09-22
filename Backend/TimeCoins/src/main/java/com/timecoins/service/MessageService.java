package com.timecoins.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.timecoins.dto.ChatUserSummary;
import com.timecoins.dto.MessageTemplate;
import com.timecoins.model.MessageHistory;
import com.timecoins.model.WebUsers;
import com.timecoins.repository.MessageHistoryRepository;
import com.timecoins.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService implements MessageServiceIn {
	
    private final MessageHistoryRepository messageHistoryRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Get chat users with unread message counts (paginated)
     */
    public Page<ChatUserSummary> getChatUsersWithUnread(Long userId, int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<Object[]> rawPage = messageHistoryRepository.findChatUsersWithUnread(userId, pageable);

        return rawPage.map(row -> new ChatUserSummary(
            ((Number) row[0]).longValue(),        // userId
            (String) row[1],                      // username
            (String) row[2],                      // fullName
            row[3] == null ? 0L : ((Number) row[3]).longValue() // unreadCount
        ));
    }

    /**
     * Search users by username or fullname
     */
    public List<ChatUserSummary> getSearchedUsers(String search) {
        List<WebUsers> users = userRepository
            .findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(search, search);

        return users.stream()
                .map(u -> new ChatUserSummary(u.getId(), u.getUsername(), u.getFullName(), 0L))
                .toList();
    }

    /**
     * Get paginated chat messages between two users
     */
    @Override
    public Page<MessageTemplate> getChatMessages(Long senderId, Long receiverId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").ascending());

    Page<MessageHistory> messageHistory = messageHistoryRepository
            .findConversation(senderId, receiverId, pageable);

    if (messageHistory == null || messageHistory.isEmpty()) {
        return Page.empty(pageable);
    }

    // Update delivered = true for all messages received by this user
    List<MessageHistory> toUpdate = messageHistory.getContent().stream()
            .filter(m -> m.getReceiverId().equals(receiverId) && !m.isDelivered())
            .peek(m -> m.setDelivered(true))
            .toList();

    if (!toUpdate.isEmpty()) {
        messageHistoryRepository.saveAll(toUpdate);
    }

    // Return as DTO Page
    return messageHistory.map(m -> new MessageTemplate(
            m.getId(),
            m.getSenderId(),
            m.getReceiverId(),
            m.getContent(),
            m.getTypeContent(),
            m.getTimestamp(),
            m.isRead(),
            m.isDelivered()
    ));
    }

    
    @Override
    public MessageTemplate pushMessage(MessageTemplate message, Long userId) {
        // Security check: sender must match JWT userId
        if (!message.getSenderId().equals(userId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "Unauthorized access"
            );
        }

        // Save new message in DB (unread, not delivered)
        MessageHistory savedHistory = messageHistoryRepository.save(
            MessageHistory.builder()
                .senderId(userId)
                .receiverId(message.getReceiverId())
                .content(message.getContent())
                .typeContent(message.getType())
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .isDelivered(false)
                .build()
        );

        // Try sending live if receiver is connected
        boolean delivered = false;
        try {
            messagingTemplate.convertAndSendToUser(
                savedHistory.getReceiverId().toString(),
                "/queue/messages",
                MessageTemplate.builder()
                    .id(savedHistory.getId())
                    .senderId(savedHistory.getSenderId())
                    .receiverId(savedHistory.getReceiverId())
                    .content(savedHistory.getContent())
                    .type(savedHistory.getTypeContent())
                    .timestamp(savedHistory.getTimestamp())
                    .isRead(false)
                    .isDelivered(false) // initially false
                    .build()
            );
            delivered = true;
        } catch (Exception e) {
            // If user not connected → message stays only in DB
        }

        // If delivered, update entity
        if (delivered) {
            savedHistory.setDelivered(true);
            savedHistory = messageHistoryRepository.save(savedHistory);
        }

        // Return DTO from final entity state
        return MessageTemplate.builder()
                .id(savedHistory.getId())
                .senderId(savedHistory.getSenderId())
                .receiverId(savedHistory.getReceiverId())
                .content(savedHistory.getContent())
                .type(savedHistory.getTypeContent())
                .timestamp(savedHistory.getTimestamp())
                .isRead(savedHistory.isRead())
                .isDelivered(savedHistory.isDelivered())
                .build();
    }



}
