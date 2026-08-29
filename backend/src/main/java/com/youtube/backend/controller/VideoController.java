package com.youtube.backend.controller;

import com.youtube.backend.dto.PageResponse;
import com.youtube.backend.dto.VideoDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.service.VideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/videos")
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    @PostMapping
    public ResponseEntity<VideoDto.VideoResponse> addVideo(
            @AuthenticationPrincipal UserEntity user,
            @Valid @RequestBody VideoDto.VideoRequest request) {
        return ResponseEntity.ok(videoService.addVideo(user, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoDto.VideoResponse> getVideoDetails(@PathVariable String id) {
        return ResponseEntity.ok(videoService.getVideoDetails(id));
    }

    @GetMapping("/me")
    public ResponseEntity<List<VideoDto.VideoResponse>> getMyVideos(@AuthenticationPrincipal UserEntity user) {
        return ResponseEntity.ok(videoService.getList(user));
    }

    @GetMapping
    public ResponseEntity<PageResponse<VideoDto.VideoResponse>> getAllVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ResponseEntity.ok(videoService.getAllVideos(page, size, sortBy, sortDir));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<VideoDto.VideoResponse>> searchVideos(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(videoService.searchVideos(query, page, size));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<VideoDto.VideoResponse> editVideo(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable String id,
            @Valid @RequestBody VideoDto.VideoRequest request) {
        return ResponseEntity.ok(videoService.editVideo(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeVideo(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable String id) {
        videoService.removeVideo(user, id);
        return ResponseEntity.ok("Video removed successfully");
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<VideoDto.VideoResponse> videoLike(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable String id) {
        return ResponseEntity.ok(videoService.toggleReaction(user, id, true));
    }

    @PostMapping("/{id}/dislike")
    public ResponseEntity<VideoDto.VideoResponse> disLike(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable String id) {
        return ResponseEntity.ok(videoService.toggleReaction(user, id, false));
    }
}