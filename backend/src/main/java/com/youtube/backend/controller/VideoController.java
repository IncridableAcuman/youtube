package com.youtube.backend.controller;

import com.youtube.backend.dto.VideoDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.service.VideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<VideoDto.VideoResponse> addVideo(@AuthenticationPrincipal UserEntity user, @Valid @RequestBody VideoDto.VideoRequest request){
        return ResponseEntity.ok(videoService.addVideo(user,request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<VideoDto.VideoResponse> getVideo(@PathVariable String id){
        return ResponseEntity.ok(videoService.getVideo(id));
    }
    @GetMapping
    public ResponseEntity<List<VideoDto.VideoResponse>> getList(@AuthenticationPrincipal UserEntity user){
        return ResponseEntity.ok(videoService.getList(user));
    }
}
