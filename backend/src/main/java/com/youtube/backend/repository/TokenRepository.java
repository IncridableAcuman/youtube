package com.youtube.backend.repository;

import com.youtube.backend.entity.TokenEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface TokenRepository extends MongoRepository<TokenEntity,System> {
    Optional<TokenEntity> findByUserId(String userId);
    Optional<TokenEntity> findByRefreshToken(String refreshToken);
}
