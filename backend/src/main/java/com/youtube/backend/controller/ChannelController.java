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

    /**
     * Yangi kanal yaratish (POST /channels)
     */
    @PostMapping
    public ResponseEntity<ChannelDto.ChannelResponse> createChannel(
            @AuthenticationPrincipal UserEntity user,
            @Valid @RequestBody ChannelDto.ChannelRequest request
    ) {
        return ResponseEntity.ok(channelService.createChannel(user, request));
    }

    /**
     * Tizimga kirgan foydalanuvchining shaxsiy kanalini olish (GET /channels/me)
     * Frontend Zustand store (/channels/me) tomonidan chaqiriladi
     */
    @GetMapping("/me")
    public ResponseEntity<ChannelDto.ChannelResponse> getMyChannel(
            @AuthenticationPrincipal UserEntity user
    ) {
        return ResponseEntity.ok(channelService.getMyChannel(user));
    }

    /**
     * Kanal ID orqali ma'lumotlarni olish (GET /channels/{channelId})
     */
    @GetMapping("/{channelId}")
    public ResponseEntity<ChannelDto.ChannelResponse> getChannelDetails(
            @PathVariable String channelId,
            @AuthenticationPrincipal UserEntity user
    ) {
        return ResponseEntity.ok(channelService.getChannelDetails(channelId, user));
    }

    /**
     * Videoni kanalga biriktirish (POST /channels/videos/{videoId}/assign)
     */
    @PostMapping("/videos/{videoId}/assign")
    public ResponseEntity<Void> assignVideoToChannel(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable String videoId
    ) {
        channelService.assignVideoToChannel(user, videoId);
        return ResponseEntity.ok().build();
    }

    /**
     * Kanalga tegishli baracha videolarni olish (GET /channels/{channelId}/videos)
     */
    @GetMapping("/{channelId}/videos")
    public ResponseEntity<List<VideoDto.VideoResponse>> getChannelVideos(
            @PathVariable String channelId
    ) {
        return ResponseEntity.ok(channelService.getChannelVideos(channelId));
    }

    /**
     * Kanalga obuna bo'lish yoki bekor qilish (POST /channels/{channelId}/subscribe)
     */
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

    /**
     * Foydalanuvchi kanalga obuna bo'lgan-bo'lmaganligini tekshirish (GET /channels/{channelId}/is-subscribed)
     */
    @GetMapping("/{channelId}/is-subscribed")
    public ResponseEntity<Boolean> isSubscribed(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable String channelId
    ) {
        return ResponseEntity.ok(channelService.isSubscribed(user.getId(), channelId));
    }
}