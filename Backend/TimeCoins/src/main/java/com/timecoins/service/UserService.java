package com.timecoins.service;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.timecoins.config.MailService;
import com.timecoins.dto.LoginInfo;
import com.timecoins.dto.RagisterInfo;
import com.timecoins.model.WebUsers;
import com.timecoins.repository.UserRepository;
import com.timecoins.security.JwtUtil;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserService implements UserServiceIn{
	
	private final UserRepository repo;
	private final PasswordEncoder encoder;
	private final JwtUtil jwt;
	private final MailService mail;
	
	
	@Override
	public String ragister(RagisterInfo user) {
	    // Check if email already exists
	    if (repo.findByEmail(user.getEmail()).isPresent()) {
	        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
	    }

	    // Check if username already exists
	    if (repo.findByUsername(user.getUsername()).isPresent()) {
	        throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
	    }

	    // Generate email verification token
	    String token = jwt.generateToken(user.getEmail());

	    // Create user entity
	    WebUsers webUser = WebUsers.builder()
	            .fullName(user.getFullName())
	            .username(user.getUsername())
	            .email(user.getEmail())
	            .password(encoder.encode(user.getPassword()))
	            .resetToken(token)
	            .isVerified(false)
	            .build();

	    // Save user
	    repo.save(webUser);

	    // Send verification email
	    mail.sendHtmlVerificationEmail(user.getEmail(), user.getFullName(), token);

	    return "User registered successfully. Please check your email to verify your account.";
	}

	
	@Override
	public RagisterInfo login(LoginInfo user) {
		Optional<WebUsers> optionalUser = user.getLogin().contains("@")
                ? repo.findByEmail(user.getLogin())
                : repo.findByUsername(user.getLogin());

        WebUsers webuser = optionalUser.orElseThrow(
        		() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!encoder.matches(user.getPassword(), webuser.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        
        if(!webuser.getIsVerified())
        	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Please verify your email first");

        return new RagisterInfo(
        		webuser.getId(),
        		webuser.getFullName(),
        		webuser.getUsername(),
        		webuser.getEmail(),
        		jwt.generateToken(webuser.getEmail())
        	);
	}

	@Override
	public String forgotten_password(String Email) {
		WebUsers user = repo.findByEmail(Email)
                .orElseThrow(
                		() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String token = jwt.generateToken(Email);
        user.setResetToken(token);
        repo.save(user);

        mail.sendPasswordResetEmail(user.getEmail(), user.getFullName(), token);
        return "Reset link sent to email";
	}
	
	@Override
	public String resetPassword(String token, String newPassword) {
	    String email = jwt.extractEmail(token);

	    WebUsers user = repo.findByResetToken(token)
	            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token"));

	    if (!user.getEmail().equals(email)) {
	        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid credentials");
	    }

	    user.setPassword(encoder.encode(newPassword));
	    user.setResetToken(null); // Clear the used token
	    repo.save(user);

	    return "Password updated successfully";
	}

	@Override
	public String confirmEmail(String token) {
		if(!jwt.validateToken(token))
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Expired link");

		String email = jwt.extractEmail(token);
		WebUsers user = repo.findByEmail(email).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid credentials"));
		if (!token.equals(user.getResetToken()))
		    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid credentials");
		user.setIsVerified(true);
		user.setResetToken(null);
		repo.save(user);
		return "Confirmed email address";
	}
	
	@Override
	public RagisterInfo getUserDetail(String username) {
	    Optional<WebUsers> user = repo.findByUsername(username);

	    if (user.isPresent()) {
	        WebUsers entity = user.get();
	        
	        // Map entity → DTO using builder
	        return RagisterInfo.builder()
	        		.id(entity.getId())
	                .fullName(entity.getFullName())
	                .username(entity.getUsername())
	                .email(entity.getEmail())
	                .build();
	    } else {
	        return null; // or throw new UserNotFoundException(username);
	    }
	}


	
}