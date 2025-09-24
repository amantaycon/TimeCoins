package com.timecoins.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ProfileDetailDto {
	private String fullName;
	private String username;
	private String bio;
	private LocalDateTime joined;
	private Long totalTransaction;
}
