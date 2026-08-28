package com.youtube.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "channels")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class ChannelEntity {
    @Id
    private String id;

    private String name;

    private String description;

    @Indexed(unique = true, sparse = true)
    private String handle;

    @Indexed(unique = true)
    private String userId;

    private int subscribers = 0;
    private LocalDateTime createdAt = LocalDateTime.now();

    public void incrementSubscribers() {
        this.subscribers++;
    }

    public void decrementSubscribers() {
        this.subscribers = Math.max(0, this.subscribers - 1);
    }
}