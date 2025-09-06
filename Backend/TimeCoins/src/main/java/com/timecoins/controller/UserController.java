package com.timecoins.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timecoins.dto.RagisterInfo;
import com.timecoins.service.UserServiceIn;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/u/")
@RequiredArgsConstructor
public class UserController {
	
	private final UserServiceIn userService;

	@PostMapping("/islogin")
    public boolean isLogin() {
		return true;
	}
	
	@GetMapping("/userdetail/{username}")
	public ResponseEntity<RagisterInfo> getUserDetail(@PathVariable String username) {
	    RagisterInfo info = userService.getUserDetail(username);
	    if (info == null) {
	        return ResponseEntity.notFound().build();
	    }
	    return ResponseEntity.ok(info);
	}

}
