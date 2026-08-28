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

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    public CommentDto.CommentResponse addCommentToVideo(UserEntity user, String videoId, CommentDto.CommentRequest request) {
        VideoEntity video = videoRepository.findById(videoId)
                .orElseThrow(() -> new CustomNotFoundException("Video not found: " + videoId));

        CommentEntity comment = new CommentEntity();
        comment.setContent(request.getContent());
        comment.setUserId(user.getId());
        comment.setVideoId(video.getId());
        commentRepository.save(comment);

        return CommentDto.CommentResponse.from(comment, UserDto.UserResponse.from(user));
    }

    public List<CommentDto.CommentResponse> getCommentsByVideoId(String videoId) {
        if (!videoRepository.existsById(videoId)) {
            throw new CustomNotFoundException("Video not found: " + videoId);
        }

        List<CommentEntity> comments = commentRepository.findByVideoIdOrderByCreatedAtDesc(videoId);

        return comments.stream().map(comment -> {
            UserEntity author = userRepository.findById(comment.getUserId())
                    .orElseThrow(() -> new CustomNotFoundException("User not found: " + comment.getUserId()));
            return CommentDto.CommentResponse.from(comment, UserDto.UserResponse.from(author));
        }).toList();
    }
    public PageResponse<CommentDto.CommentResponse> getCommentsByVideoId(String videoId, int page, int size) {
        // 1. Video bazada bor-yo'qligini tekshirish
        if (!videoRepository.existsById(videoId)) {
            throw new CustomNotFoundException("Video topilmadi: " + videoId);
        }

        // 2. Sahifalash va eng yangi izohlarni birinchi chiqarish uchun saralash (createdAt DESC)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 3. Bazadan sahifalangan izohlarni olish
        Page<CommentEntity> commentPage = commentRepository.findByVideoId(videoId, pageable);

        // 4. Page.map() yordamida har bir izoh muallifini yuklab, DTO ga o'girish
        Page<CommentDto.CommentResponse> dtoPage = commentPage.map(comment -> {
            UserEntity author = userRepository.findById(comment.getUserId())
                    .orElseThrow(() -> new CustomNotFoundException("Izoh muallifi topilmadi: " + comment.getUserId()));
            return CommentDto.CommentResponse.from(comment, UserDto.UserResponse.from(author));
        });

        // 5. Tayyor Page DTO ni moslashtirilgan PageResponse formatida qaytarish
        return PageResponse.from(dtoPage);
    }
}