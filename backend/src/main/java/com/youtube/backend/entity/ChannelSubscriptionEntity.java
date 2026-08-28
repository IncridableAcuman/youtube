package com.youtube.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "channel_subscriptions")
@CompoundIndex(name = "user_channel_idx", def = "{'subscriberUserId': 1, 'channelId': 1}", unique = true)
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class ChannelSubscriptionEntity {
    @Id
    private String id;
    private String subscriberUserId;
    private String channelId;
    private LocalDateTime createdAt = LocalDateTime.now();
}
