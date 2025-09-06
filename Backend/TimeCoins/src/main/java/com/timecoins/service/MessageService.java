package com.timecoins.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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
    public Page<MessageTemplate> getChatMessages(Long senderId, Long receiverId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").ascending());

        Page<MessageHistory> messageHistory = messageHistoryRepository
                .findConversation(
                        senderId, receiverId, pageable);
        
        if (messageHistory == null || messageHistory.isEmpty()) {
            return Page.empty(pageable);
        }

        return messageHistory.map(m -> new MessageTemplate(
                m.getId(),
                m.getSenderId(),
                m.getReceiverId(),
                m.getContent(),
                m.getTypeContent(),
                m.getTimestamp(),
                m.isRead()
        ));
    }

    @Override
    public MessageTemplate pushMessage(MessageTemplate message, Long userId) {
        if (!message.getSenderId().equals(userId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "Unauthorized access"
            );
        }

        // Build and save entity
        MessageHistory savedHistory = messageHistoryRepository.save(
            MessageHistory.builder()
                .senderId(userId)
                .receiverId(message.getReceiverId())
                .content(message.getContent())
                .typeContent(message.getType())
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build()
        );

        // Map back to DTO
        return MessageTemplate.builder()
                .id(savedHistory.getId()) // assuming MessageHistory has an auto-generated id
                .senderId(savedHistory.getSenderId())
                .receiverId(savedHistory.getReceiverId())
                .content(savedHistory.getContent())
                .type(savedHistory.getTypeContent())
                .timestamp(savedHistory.getTimestamp())
                .build();
    }

}
