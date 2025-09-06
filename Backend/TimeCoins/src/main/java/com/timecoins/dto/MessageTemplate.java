package com.timecoins.dto;

import java.time.LocalDateTime;

import com.timecoins.model.TypeContent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class MessageTemplate {
	private Long id;
	private Long senderId;
	private Long receiverId;
	private String content;
	private TypeContent type;
	private LocalDateTime timestamp;
	private boolean isRead;
}
