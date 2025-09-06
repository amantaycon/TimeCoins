package com.timecoins.service;

import com.timecoins.dto.LoginInfo;
import com.timecoins.dto.RagisterInfo;

public interface UserServiceIn {
	public RagisterInfo login(LoginInfo user);
	public String ragister(RagisterInfo user);
	public String forgotten_password(String Email);
	public String resetPassword(String token, String newPassword);
	public String confirmEmail(String token);
	public RagisterInfo getUserDetail(String username);
}
