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
        @NotBlank private String duration;
    }

    public record VideoResponse(
            String id,
            String userId,
            String title,
            String description,
            String youtubeUrl,
            String youtubeKey,
            String thumbnailUrl,
            String duration,
            int views,
            int likes,
            int dislikes,
            LocalDateTime createdAt,
            String channelId,
            String channelName // <--- Kanal nomi qo'shildi
    ){
        public static VideoResponse from(VideoEntity video, String channelName){
            String thumbnail = "https://img.youtube.com/vi/" + video.getYoutubeKey() + "/hqdefault.jpg";

            return new VideoResponse(
                    video.getId(),
                    video.getUserId(),
                    video.getTitle(),
                    video.getDescription(),
                    video.getYoutubeUrl(),
                    video.getYoutubeKey(),
                    thumbnail,
                    video.getDuration(),
                    video.getViews(),
                    video.getLikes(),
                    video.getDislikes(),
                    video.getCreatedAt(),
                    video.getChannelId(),
                    channelName
            );
        }

        public static VideoResponse from(VideoEntity video){
            return from(video, null);
        }
    }
}