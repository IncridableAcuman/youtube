package com.youtube.backend.service;

import com.youtube.backend.entity.TokenEntity;
import com.youtube.backend.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;

    @Transactional(readOnly = true)
    public Optional<TokenEntity> findTokenByUser(String userId) {
        return tokenRepository.findByUserId(userId);
    }

    @Transactional
    public void saveToken(String userId, String refreshToken) {
        TokenEntity token = findTokenByUser(userId).orElseGet(TokenEntity::new);
        token.setUserId(userId);
        token.setRefreshToken(refreshToken);
        token.setExpiryDate(OffsetDateTime.now().plusDays(7));
        tokenRepository.save(token);
    }

    @Transactional
    public void removeToken(String userId) {
        tokenRepository.findByUserId(userId).ifPresent(tokenRepository::delete);
    }
}
