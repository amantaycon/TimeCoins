package com.timecoins.service;

import com.timecoins.model.WebUsers;
import com.timecoins.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	 private final UserRepository repo;

	    @Override
	    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
	        WebUsers user = repo.findByEmail(emailOrUsername)
	                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + emailOrUsername));

	        return new CustomUserDetails(user); // ✅ return your own class
	    }
}
