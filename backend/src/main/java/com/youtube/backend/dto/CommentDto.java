package com.youtube.backend.dto;

import com.youtube.backend.entity.CommentEntity;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDto {

    @Data
    public static class CommentRequest {
        private String content;
    }
    public record CommentResponse(
            String id,
            String videoId,
            UserDto.UserResponse user,
            String content,
            LocalDateTime createdAt
    ){
        public static CommentResponse from(CommentEntity comment,UserDto.UserResponse user){
            return new CommentResponse(
                    comment.getId(),
                    comment.getVideoId(),
                    user,
                    comment.getContent(),
                    comment.getCreatedAt()
            );
        }
    }
}
