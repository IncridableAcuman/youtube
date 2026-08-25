package com.youtube.backend.repository;

import com.youtube.backend.entity.TokenEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TokenRepository extends MongoRepository<TokenEntity,System> {
    Optional<TokenEntity> findByUserId(String userId);
    Optional<TokenEntity> findByRefreshToken(String refreshToken);
}
