package com.youtube.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.TextScore;

import java.time.LocalDateTime;
import java.util.Set;

@Document(collection = "videos")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class VideoEntity {
    @Id
    private String id;
    private String userId;
    @TextIndexed(weight = 3)
    private String title;
    @TextIndexed(weight = 1)
    private String description;
    private String youtubeUrl;
    @Indexed(unique = true)
    private String youtubeKey;
    private String duration;
    private int views = 0;
    private Set<String> tags;
    private int likes = 0;
    private int dislikes = 0;
    private String channelId;
    private LocalDateTime createdAt = LocalDateTime.now();
    @TextScore
    private Float score;

    public void incrementLikes() {
        this.likes++;
    }

    public void decrementLikes() {
        this.likes = Math.max(0, this.likes - 1);
    }

    public void incrementDislikes() { // incrementDisLikes -> incrementDislikes
        this.dislikes++;
    }

    public void decrementDislikes() {
        this.dislikes = Math.max(0, this.dislikes - 1);
    }

    public void incrementViews() {
        this.views++;
    }
}