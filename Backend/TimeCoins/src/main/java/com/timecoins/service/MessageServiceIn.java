package com.timecoins.service;


import java.util.List;

import org.springframework.data.domain.Page;

import com.timecoins.dto.ChatUserSummary;
import com.timecoins.dto.MessageTemplate;

public interface MessageServiceIn {
	public Page<ChatUserSummary> getChatUsersWithUnread(Long userId, int page, int size);
	public List<ChatUserSummary> getSearchedUsers(String search);
	public Page<MessageTemplate> getChatMessages(Long senderId, Long receiverId, int page, int size);
	public MessageTemplate pushMessage(MessageTemplate message, Long userId);
}
