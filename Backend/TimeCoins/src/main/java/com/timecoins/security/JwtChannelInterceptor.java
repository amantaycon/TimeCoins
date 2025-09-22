package com.timecoins.security;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import com.timecoins.model.WebUsers;
import com.timecoins.repository.UserRepository;

import java.security.Principal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> authHeaders = accessor.getNativeHeader("Authorization");
            String token = null;

            if (authHeaders != null && !authHeaders.isEmpty()) {
                String raw = authHeaders.get(0);
                if (raw.startsWith("Bearer ")) {
                    raw = raw.substring(7);
                }
                token = raw;
            }

            if (token == null || !jwtUtil.validateToken(token)) {
                throw new IllegalArgumentException("Invalid or missing JWT token");
            }

            String email = jwtUtil.extractEmail(token);
            
            WebUsers userEntity = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + email));

            // 🔹 Set userId as Principal name
            Principal user = new StompPrincipal(userEntity.getId().toString());
            accessor.setUser(user);
        }

        return message;
    }
}
