package com.youtube.backend.service;

import com.youtube.backend.dto.CommentDto;
import com.youtube.backend.dto.PageResponse;
import com.youtube.backend.dto.UserDto;
import com.youtube.backend.entity.CommentEntity;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.VideoEntity;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.CommentRepository;
import com.youtube.backend.repository.UserRepository;
import com.youtube.backend.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    public CommentDto.CommentResponse addCommentToVideo(UserEntity user, String videoId, CommentDto.CommentRequest request) {
        VideoEntity video = videoRepository.findById(videoId)
                .orElseThrow(() -> new CustomNotFoundException("Video topilmadi: " + videoId));

        CommentEntity comment = new CommentEntity();
        comment.setContent(request.getContent());
        comment.setUserId(user.getId());
        comment.setVideoId(video.getId());
        commentRepository.save(comment);

        return CommentDto.CommentResponse.from(comment, UserDto.UserResponse.from(user));
    }

    public PageResponse<CommentDto.CommentResponse> getCommentsByVideoId(String videoId, int page, int size) {
        if (!videoRepository.existsById(videoId)) {
            throw new CustomNotFoundException("Video topilmadi: " + videoId);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CommentEntity> commentPage = commentRepository.findByVideoId(videoId, pageable);

        // N+1 muammosini hal etish: Sahifadagi barcha userId larni yig'ib olish
        List<String> userIds = commentPage.getContent().stream()
                .map(CommentEntity::getUserId)
                .distinct()
                .toList();

        // Foydalanuvchilarni bitta so'rov bilan bazadan yuklash va Map ga joylash
        Map<String, UserEntity> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, Function.identity()));

        // DTO ga o'girish
        Page<CommentDto.CommentResponse> dtoPage = commentPage.map(comment -> {
            UserEntity author = userMap.get(comment.getUserId());
            if (author == null) {
                throw new CustomNotFoundException("Izoh muallifi topilmadi: " + comment.getUserId());
            }
            return CommentDto.CommentResponse.from(comment, UserDto.UserResponse.from(author));
        });

        return PageResponse.from(dtoPage);
    }
}