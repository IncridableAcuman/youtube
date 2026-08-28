package com.youtube.backend.service;

import com.youtube.backend.dto.PageResponse;
import com.youtube.backend.dto.VideoDto;
import com.youtube.backend.entity.ChannelEntity;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.VideoEntity;
import com.youtube.backend.entity.VideoLikesEntity;
import com.youtube.backend.exception.CustomBadRequestException;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.ChannelRepository;
import com.youtube.backend.repository.VideoLikesRepository;
import com.youtube.backend.repository.VideoRepository;
import com.youtube.backend.util.YoutubeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepository;
    private final VideoLikesRepository videoLikesRepository;
    private final ChannelRepository channelRepository;
    private final YoutubeUtil youtubeUtil;

    // Video tegishli bo'lgan kanal nomini aniqlash yordamchi metodi
    private String resolveChannelName(VideoEntity video) {
        if (video.getChannelId() != null) {
            return channelRepository.findById(video.getChannelId())
                    .map(ChannelEntity::getName)
                    .orElse(null);
        }
        if (video.getUserId() != null) {
            return channelRepository.findByUserId(video.getUserId())
                    .map(ChannelEntity::getName)
                    .orElse(null);
        }
        return null;
    }

    // Videolar ro'yxati uchun kanal nomlarini ommaviy yuklash
    private List<VideoDto.VideoResponse> mapToVideoResponseList(List<VideoEntity> videos) {
        if (videos == null || videos.isEmpty()) {
            return List.of();
        }

        Set<String> channelIds = videos.stream()
                .map(VideoEntity::getChannelId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, String> channelMap = channelRepository.findAllById(channelIds).stream()
                .collect(Collectors.toMap(ChannelEntity::getId, ChannelEntity::getName));

        return videos.stream()
                .map(v -> {
                    String channelName = v.getChannelId() != null ? channelMap.get(v.getChannelId()) : null;
                    if (channelName == null) {
                        channelName = resolveChannelName(v);
                    }
                    return VideoDto.VideoResponse.from(v, channelName);
                })
                .toList();
    }

    public VideoDto.VideoResponse addVideo(UserEntity user, VideoDto.VideoRequest request) {
        String extractedKey = youtubeUtil.extractVideoId(request.getYoutubeUrl());
        if (extractedKey == null) {
            throw new CustomBadRequestException("Incorrect YouTube URL");
        }
        if (videoRepository.existsByYoutubeKey(extractedKey)) {
            throw new CustomBadRequestException("This video has already been added");
        }

        VideoEntity video = new VideoEntity();
        video.setUserId(user.getId());
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setYoutubeUrl(request.getYoutubeUrl());
        video.setYoutubeKey(extractedKey);
        video.setDuration(request.getDuration());

        channelRepository.findByUserId(user.getId())
                .ifPresent(channel -> video.setChannelId(channel.getId()));

        videoRepository.save(video);
        return VideoDto.VideoResponse.from(video, resolveChannelName(video));
    }

    public List<VideoDto.VideoResponse> getList(UserEntity user) {
        List<VideoEntity> list = videoRepository.findByUserId(user.getId());
        return mapToVideoResponseList(list);
    }

    public VideoEntity findVideoById(String id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Video not found: " + id));
    }

    public VideoDto.VideoResponse editVideo(UserEntity user, String id, VideoDto.VideoRequest request) {
        VideoEntity video = findVideoById(id);
        if (!video.getUserId().equals(user.getId())) {
            throw new CustomBadRequestException("Only the author can edit this video");
        }
        Optional.ofNullable(request.getTitle()).ifPresent(video::setTitle);
        Optional.ofNullable(request.getDescription()).ifPresent(video::setDescription);
        Optional.ofNullable(request.getYoutubeUrl()).ifPresent(video::setYoutubeUrl);
        videoRepository.save(video);
        return VideoDto.VideoResponse.from(video, resolveChannelName(video));
    }

    public void removeVideo(UserEntity user, String id) {
        VideoEntity video = findVideoById(id);
        if (!video.getUserId().equals(user.getId())) {
            throw new CustomBadRequestException("Only the author can delete this video");
        }
        videoRepository.delete(video);
    }

    public VideoDto.VideoResponse getVideoDetails(String id) {
        VideoEntity video = findVideoById(id);
        increaseVideoViews(video);
        return VideoDto.VideoResponse.from(video, resolveChannelName(video));
    }

    public void increaseVideoViews(VideoEntity video) {
        video.incrementViews();
        videoRepository.save(video);
    }

    @Transactional
    public VideoDto.VideoResponse toggleReaction(UserEntity user, String videoId, boolean isLike) {
        VideoEntity video = findVideoById(videoId);
        Optional<VideoLikesEntity> existsLike = videoLikesRepository.findByUserIdAndVideoId(user.getId(), videoId);

        if (existsLike.isPresent()) {
            VideoLikesEntity likesEntity = existsLike.get();
            if (likesEntity.isLike() == isLike) {
                videoLikesRepository.delete(likesEntity);
                if (isLike) {
                    video.decrementLikes();
                } else {
                    video.decrementDislikes();
                }
            } else {
                likesEntity.setLike(isLike);
                videoLikesRepository.save(likesEntity);

                if (isLike) {
                    video.incrementLikes();
                    video.decrementDislikes();
                } else {
                    video.incrementDislikes();
                    video.decrementLikes();
                }
            }
        } else {
            VideoLikesEntity entity = new VideoLikesEntity();
            entity.setUserId(user.getId());
            entity.setVideoId(video.getId());
            entity.setLike(isLike);
            entity.setCreatedAt(LocalDateTime.now());
            videoLikesRepository.save(entity);

            if (isLike) {
                video.incrementLikes();
            } else {
                video.incrementDislikes();
            }
        }
        videoRepository.save(video);
        return VideoDto.VideoResponse.from(video, resolveChannelName(video));
    }

    public Page<VideoDto.VideoResponse> searchVideos(String query, int page, int size) {
        if (query == null || query.trim().isEmpty()) {
            return Page.empty();
        }

        TextCriteria criteria = TextCriteria.forDefaultLanguage()
                .matchingAny(query.trim().split("\\s+"));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "score")
        );

        Page<VideoEntity> videoPage = videoRepository.findAllBy(criteria, pageable);
        List<VideoDto.VideoResponse> dtoList = mapToVideoResponseList(videoPage.getContent());
        return new PageImpl<>(dtoList, pageable, videoPage.getTotalElements());
    }

    public PageResponse<VideoDto.VideoResponse> getAllVideos(
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<VideoEntity> videoPage = videoRepository.findAll(pageable);

        List<VideoDto.VideoResponse> dtoList = mapToVideoResponseList(videoPage.getContent());

        return PageResponse.from(
                new PageImpl<>(dtoList, pageable, videoPage.getTotalElements())
        );
    }
}