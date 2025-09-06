package com.timecoins.dto;

import lombok.Data;

@Data
public class ResetPassword {
	String token;
	String newPassword;
}
