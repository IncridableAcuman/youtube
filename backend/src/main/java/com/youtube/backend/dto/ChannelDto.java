package com.youtube.backend.dto;

import com.youtube.backend.entity.ChannelEntity;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.VideoEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChannelDto {

    @Data
    public static class ChannelRequest {
        @NotBlank private String name;
    }
    public record ChannelResponse(
            String id,
            String name,
            UserDto.UserResponse user,
            List<VideoEntity> videos,
            LocalDateTime createdAt
    ){
        public static ChannelResponse from(ChannelEntity channel, UserEntity user){
            return new ChannelResponse(
                    channel.getId(),
                    channel.getName(),
                    UserDto.UserResponse.from(user),
                    channel.getVideos(),
                    channel.getCreatedAt()
            );
        }
    }
}
