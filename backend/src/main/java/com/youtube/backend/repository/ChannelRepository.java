package com.youtube.backend.repository;

import com.youtube.backend.entity.ChannelEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChannelRepository extends MongoRepository<ChannelEntity,String> {
    Optional<ChannelEntity> findByUserId(String userId);
}
