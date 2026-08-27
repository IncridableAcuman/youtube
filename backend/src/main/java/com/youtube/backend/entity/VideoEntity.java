package com.youtube.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Document(collection = "videos")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class VideoEntity {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private String youtubeUrl;
    private String youtubeKey;
    private int views;
    private Set<String> tags;
    private int likes;
    private int dislikes;
    private LocalDateTime createdAt=LocalDateTime.now();
}
