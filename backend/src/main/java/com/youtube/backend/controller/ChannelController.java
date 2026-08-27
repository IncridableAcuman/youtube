package com.youtube.backend.controller;

import com.youtube.backend.dto.ChannelDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.service.ChannelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/channels")
@RequiredArgsConstructor
public class ChannelController {
    private final ChannelService channelService;

    @PostMapping
    public ResponseEntity<ChannelDto.ChannelResponse> createChannel(
            @AuthenticationPrincipal UserEntity user,
            @Valid @RequestBody ChannelDto.ChannelRequest request
    ){
        return ResponseEntity.ok(channelService.createChannel(user,request));
    }
    @PostMapping("/videos/{videoId}")
    public ResponseEntity<ChannelDto.ChannelResponse> addVideoToChannel(@AuthenticationPrincipal UserEntity user, @PathVariable String videoId){
        return ResponseEntity.ok(channelService.addVideoToChannel(user,videoId));
    }
}
