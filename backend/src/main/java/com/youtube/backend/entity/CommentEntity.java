package com.youtube.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "comments")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class CommentEntity {
    @Id
    private String id;

    private String content;
    private String videoId;
    private String userId;
    private LocalDateTime createdAt;
}
