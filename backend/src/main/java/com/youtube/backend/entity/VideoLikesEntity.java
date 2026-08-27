package com.youtube.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import java.time.LocalDateTime;

@Document(collection = "video_likes")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@CompoundIndexes({
        @CompoundIndex(name = "user_video_like_idx",def = "{'userId':1,'videoId':1}",unique = true)
})
public class VideoLikesEntity {
    @Id
    private String id;

    private String videoId;
    private String userId;
    private boolean isLike;
    private LocalDateTime createdAt;
}
