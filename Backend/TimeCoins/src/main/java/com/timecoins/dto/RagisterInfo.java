package com.timecoins.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class RagisterInfo {
	private Long id;
	private String fullName;
	private String username;
	private String email;
	private String password;
}
