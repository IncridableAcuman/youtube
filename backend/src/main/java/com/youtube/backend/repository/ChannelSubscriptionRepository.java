package com.youtube.backend.repository;

import com.youtube.backend.entity.ChannelSubscriptionEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChannelSubscriptionRepository extends MongoRepository<ChannelSubscriptionEntity, String> {
    Optional<ChannelSubscriptionEntity> findBySubscriberUserIdAndChannelId(String subscriberUserId, String channelId);
    boolean existsBySubscriberUserIdAndChannelId(String subscriberUserId, String channelId);
}
