package com.youtube.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "channels")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class ChannelEntity {
    @Id
    private String id;

    private String name;
    private String userId;
    private List<VideoEntity> videos = new ArrayList<>();
    private LocalDateTime createdAt=LocalDateTime.now();
}
