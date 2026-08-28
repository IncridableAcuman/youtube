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
        private String description;
        private String handle;
    }

    public record ChannelResponse(
            String id,
            String name,
            String description,
            String handle,
            UserDto.UserResponse user,
            int subscribersCount, // <--- Frontend uchun subscribersCount qlindi
            boolean isSubscribed,  // <--- Obuna holati qo'shildi
            String avatarUrl,
            String bannerUrl,
            LocalDateTime createdAt
    ){
        public static ChannelResponse from(ChannelEntity channel, UserEntity user, boolean isSubscribed){
            return new ChannelResponse(
                    channel.getId(),
                    channel.getName(),
                    channel.getDescription(),
                    channel.getHandle(),
                    user != null ? UserDto.UserResponse.from(user) : null,
                    channel.getSubscribers(),
                    isSubscribed,
                    user != null ? user.getAvatar() : null,
                    null, // Banner URL mavjud bo'lsa joylaysiz
                    channel.getCreatedAt()
            );
        }

        public static ChannelResponse from(ChannelEntity channel, UserEntity user){
            return from(channel, user, false);
        }
    }
}