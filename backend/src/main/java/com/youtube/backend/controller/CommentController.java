package com.youtube.backend.controller;

import com.youtube.backend.dto.CommentDto;
import com.youtube.backend.dto.PageResponse;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDto.CommentResponse> addCommentToVideo(
            @AuthenticationPrincipal UserEntity user,
            @RequestParam String videoId,
            @Valid @RequestBody CommentDto.CommentRequest request) {
        return ResponseEntity.ok(commentService.addCommentToVideo(user, videoId, request));
    }

    @GetMapping("/video/{videoId}")
    public ResponseEntity<PageResponse<CommentDto.CommentResponse>> getCommentsByVideo(
            @PathVariable String videoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(commentService.getCommentsByVideoId(videoId, page, size));
    }
}