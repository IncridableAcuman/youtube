package com.youtube.backend.controller;

import com.youtube.backend.dto.CommentDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDto.CommentResponse> addCommentToVideo(
            @AuthenticationPrincipal UserEntity user,
            @RequestParam String videoId, @RequestBody CommentDto.CommentRequest request){
        return ResponseEntity.ok(commentService.addCommentToVideo(user,videoId,request));
    }
    @GetMapping
    public ResponseEntity<List<CommentDto.CommentResponse>> getComments(@AuthenticationPrincipal UserEntity user,@RequestParam String videoId){
        return ResponseEntity.ok(commentService.getComments(user,videoId));
    }
}
