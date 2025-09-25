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
import com.timecoins.dto.UsersDetails;
import com.timecoins.service.UserServiceIn;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LoginController {

    private final UserServiceIn userService;

    @PostMapping("/login")
    public UsersDetails login(@RequestBody LoginInfo user) throws InterruptedException {
    	Thread.sleep(2000);
        return userService.login(user);
    }

    @PostMapping("/register")
    public String register(@RequestBody RagisterInfo user) throws InterruptedException {
    	Thread.sleep(2000);
        return userService.ragister(user);
    }

    @PostMapping("/forgotten_password")
    public String forgottenPassword(@RequestBody Forgotten_Password user) throws InterruptedException {
    	Thread.sleep(2000);
        return userService.forgotten_password(user.getEmail());
    }
    
    @PostMapping("/reset")
    public String resetPassword(@RequestBody ResetPassword req) throws InterruptedException {
    	Thread.sleep(1000);
        return userService.resetPassword(req.getToken(), req.getNewPassword());
    }
    
    @PostMapping("/verify")
    public String verifyEmail(@RequestBody RequestToken req) throws InterruptedException {
    	Thread.sleep(1000);
    	return userService.confirmEmail(req.getToken());
    }
}
