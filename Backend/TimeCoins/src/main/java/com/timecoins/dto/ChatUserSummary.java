package com.timecoins.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ChatUserSummary {
    private Long userId;
    private String username;
    private String fullName;
    private Boolean hasSeen;

}
