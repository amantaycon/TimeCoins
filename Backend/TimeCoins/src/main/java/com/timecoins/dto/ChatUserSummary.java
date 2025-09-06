package com.timecoins.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatUserSummary {
    private Long userId;
    private String username;
    private String fullName;
    private Long unreadCount;

}
