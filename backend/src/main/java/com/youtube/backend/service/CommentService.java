package com.youtube.backend.service;

import com.youtube.backend.dto.CommentDto;
import com.youtube.backend.dto.UserDto;
import com.youtube.backend.entity.CommentEntity;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.VideoEntity;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.CommentRepository;
import com.youtube.backend.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final VideoRepository videoRepository;

    public CommentDto.CommentResponse addCommentToVideo(UserEntity user,String videoId,CommentDto.CommentRequest request){
        VideoEntity video = videoRepository.findById(videoId).orElseThrow(()-> new CustomNotFoundException("Video not found: " + videoId));
        CommentEntity comment = new CommentEntity();
        comment.setContent(request.getContent());
        comment.setUserId(user.getId());
        comment.setVideoId(video.getId());
        commentRepository.save(comment);
        return CommentDto.CommentResponse.from(comment, UserDto.UserResponse.from(user));
    }
}
