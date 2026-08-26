package com.youtube.backend.dto;

import com.youtube.backend.entity.VideoEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VideoDto {

    @Data
    public static class VideoRequest {
       @NotBlank private String title;
       @NotBlank private String description;
       @NotBlank private String youtubeUrl;
       @NotBlank private String youtubeKey;
    }
    public record VideoResponse(
            String id,
            String authorId,
            String title,
            String description,
            String youtubeUrl,
            String youtubeKey,
            LocalDateTime createdAt
    ){
        public static VideoResponse from(VideoEntity video){
            return new VideoResponse(
                    video.getId(),
                    video.getAuthorId(),
                    video.getTitle(),
                    video.getDescription(),
                    video.getYoutubeUrl(),
                    video.getYoutubeKey(),
                    video.getCreatedAt()
            );
        }
    }
}
