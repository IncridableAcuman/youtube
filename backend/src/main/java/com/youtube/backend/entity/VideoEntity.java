package com.youtube.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
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
    @TextIndexed
    private String title;
    @TextIndexed
    private String description;
    private String youtubeUrl;
    @Indexed(unique = true)
    private String youtubeKey;
    private String duration;
    private int views=0;
    private Set<String> tags;
    private int likes=0;
    private int dislikes=0;
    private LocalDateTime createdAt=LocalDateTime.now();


    public void incrementLikes(){
        this.likes++;}
    public void decrementLikes(){
        this.likes = Math.max(0,this.likes-1);}

    public void incrementDisLikes(){
        this.dislikes++;}
    public void decrementDislikes(){
        this.dislikes = Math.max(0,this.dislikes-1);}

    public void incrementViews(){
        this.views++;}
}
