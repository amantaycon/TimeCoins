package com.timecoins.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UsersDetails {
	private Long id;
	private String fullName;
	private String username;
	private String email;
	private String token;
	private String bio;
	private Boolean webNotification;
	private Boolean timeCoinsUpdateNotification;
	private Boolean darkMode;
}
