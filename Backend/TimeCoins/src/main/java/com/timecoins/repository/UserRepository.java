package com.timecoins.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.timecoins.model.WebUsers;

public interface UserRepository extends JpaRepository<WebUsers, Long>{
	Optional<WebUsers> findByEmail(String email);
	Optional<WebUsers> findByUsername(String username);
    Optional<WebUsers> findByResetToken(String token);
    List<WebUsers> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(String username, String fullName);

}
