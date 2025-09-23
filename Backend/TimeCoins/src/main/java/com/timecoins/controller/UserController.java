package com.timecoins.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timecoins.dto.RagisterInfo;
import com.timecoins.dto.UsersDetails;
import com.timecoins.service.CustomUserDetails;
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
	
	@PostMapping("/setting")
	public ResponseEntity<?> updateSetting(@RequestBody UsersDetails usersDetails, 
	                                       Authentication authentication) {
	    CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
	    Long loggedInUserId = customUserDetails.getId();

	    // Ensure user is updating their own account
	    if (!loggedInUserId.equals(usersDetails.getId())) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN)
	                .body(Map.of("error", "You are not authorized to update this account."));
	    }

	    UsersDetails updatedUser = userService.updateSetting(usersDetails);

	    return ResponseEntity.ok(updatedUser);
	}


}
