package com.youtube.backend.controller;

import com.youtube.backend.dto.ChannelDto;
import com.youtube.backend.dto.VideoDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.service.ChannelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/channels")
@RequiredArgsConstructor
public class ChannelController {
    private final ChannelService channelService;

    @PostMapping
    public ResponseEntity<ChannelDto.ChannelResponse> createChannel(
            @AuthenticationPrincipal UserEntity user,
            @Valid @RequestBody ChannelDto.ChannelRequest request
    ) {
        return ResponseEntity.ok(channelService.createChannel(user, request));
    }

    @GetMapping("/{channelId}")
    public ResponseEntity<ChannelDto.ChannelResponse> getChannelDetails(@PathVariable String channelId) {
        return ResponseEntity.ok(channelService.getChannelDetails(channelId));
    }

    @PostMapping("/videos/{videoId}/assign")
    public ResponseEntity<Void> assignVideoToChannel(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable String videoId
    ) {
        channelService.assignVideoToChannel(user, videoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{channelId}/videos")
    public ResponseEntity<List<VideoDto.VideoResponse>> getChannelVideos(@PathVariable String channelId) {
        return ResponseEntity.ok(channelService.getChannelVideos(channelId));
    }

    @PostMapping("/{channelId}/subscribe")
    public ResponseEntity<Map<String, Object>> toggleSubscription(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable String channelId
    ) {
        boolean isSubscribed = channelService.toggleSubscription(user, channelId);
        return ResponseEntity.ok(Map.of(
                "subscribed", isSubscribed,
                "message", isSubscribed ? "You have subscribed to the channel." : "Subscription canceled."
        ));
    }
}