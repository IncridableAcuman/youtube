package com.youtube.backend.dto;

import com.youtube.backend.entity.ChannelEntity;
import com.youtube.backend.entity.UserEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChannelDto {

    @Data
    public static class ChannelRequest {
        @NotBlank(message = "Channel name is null")
        private String name;
    }

    public record ChannelResponse(
            String id,
            String name,
            UserDto.UserResponse user,
            int subscribers,
            LocalDateTime createdAt
    ){
        public static ChannelResponse from(ChannelEntity channel, UserEntity user){
            return new ChannelResponse(
                    channel.getId(),
                    channel.getName(),
                    UserDto.UserResponse.from(user),
                    channel.getSubscribers(),
                    channel.getCreatedAt()
            );
        }
    }
}