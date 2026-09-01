package com.youtube.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.youtube.backend.entity.TokenEntity;
@Repository
public interface TokenRepository extends MongoRepository<TokenEntity,String> {
    Optional<TokenEntity> findByUserId(String userId);
    Optional<TokenEntity> findByRefreshToken(String refreshToken);
}
