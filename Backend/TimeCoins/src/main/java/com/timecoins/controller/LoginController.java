package com.timecoins.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timecoins.dto.Forgotten_Password;
import com.timecoins.dto.LoginInfo;
import com.timecoins.dto.RagisterInfo;
import com.timecoins.dto.RequestToken;
import com.timecoins.dto.ResetPassword;
import com.timecoins.service.UserServiceIn;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LoginController {

    private final UserServiceIn userService;

    @PostMapping("/login")
    public RagisterInfo login(@RequestBody LoginInfo user) {
        return userService.login(user);
    }

    @PostMapping("/register")
    public String register(@RequestBody RagisterInfo user) {
        return userService.ragister(user);
    }

    @PostMapping("/forgotten_password")
    public String forgottenPassword(@RequestBody Forgotten_Password user) {
    	System.out.println(user);
        return userService.forgotten_password(user.getEmail());
    }
    
    @PostMapping("/reset")
    public String resetPassword(@RequestBody ResetPassword req) {
        return userService.resetPassword(req.getToken(), req.getNewPassword());
    }
    
    @PostMapping("/verify")
    public String verifyEmail(@RequestBody RequestToken req) {
    	return userService.confirmEmail(req.getToken());
    }
}
