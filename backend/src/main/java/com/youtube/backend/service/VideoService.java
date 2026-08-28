package com.youtube.backend.service;

import com.youtube.backend.dto.PageResponse;
import com.youtube.backend.dto.VideoDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.VideoEntity;
import com.youtube.backend.entity.VideoLikesEntity;
import com.youtube.backend.exception.CustomBadRequestException;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.VideoLikesRepository;
import com.youtube.backend.repository.VideoRepository;
import com.youtube.backend.util.YoutubeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepository;
    private final VideoLikesRepository videoLikesRepository;
    private final YoutubeUtil youtubeUtil;

    public VideoDto.VideoResponse addVideo(UserEntity user,VideoDto.VideoRequest request){
        String extractedKey = youtubeUtil.extractVideoId(request.getYoutubeUrl());
        if (extractedKey == null){
            throw new CustomBadRequestException("Incorrect YouTube url");}
        if (videoRepository.existsByYoutubeKey(extractedKey)){
            throw new CustomBadRequestException("This video already added");}
        VideoEntity video = new VideoEntity();
        video.setUserId(user.getId());
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setYoutubeUrl(request.getYoutubeUrl());
        video.setYoutubeKey(extractedKey);
        video.setDuration(request.getDuration());
        videoRepository.save(video);
        return VideoDto.VideoResponse.from(video);
    }
    public List<VideoDto.VideoResponse> getList(UserEntity user){
        List<VideoEntity> list = videoRepository.findByUserId(user.getId());
        return list
                .stream()
                .map(VideoDto.VideoResponse::from).toList();
    }
    public VideoEntity findVideoById(String id){
        return videoRepository.findById(id).orElseThrow(()-> new CustomNotFoundException("Video not found"));
    }
    public VideoDto.VideoResponse editVideo(UserEntity user,String id,VideoDto.VideoRequest request){
        VideoEntity video = findVideoById(id);
        if (!video.getUserId().equals(user.getId())){
            throw new CustomBadRequestException("Only author can edit this video");}
        Optional.ofNullable(request.getTitle()).ifPresent(video::setTitle);
        Optional.ofNullable(request.getDescription()).ifPresent(video::setDescription);
        Optional.ofNullable(request.getYoutubeUrl()).ifPresent(video::setYoutubeUrl);
        videoRepository.save(video);
        return VideoDto.VideoResponse.from(video);
    }
    public void removeVideo(UserEntity user,String id){
        VideoEntity video = findVideoById(id);
        if (!video.getUserId().equals(user.getId())){
            throw new CustomBadRequestException("Only author can edit this video");}
        videoRepository.delete(video);
    }
    public VideoDto.VideoResponse getVideoDetails(String id){
        VideoEntity video = findVideoById(id);
        increateVideoViews(video);
        return VideoDto.VideoResponse.from(video);
    }
    public void increateVideoViews(VideoEntity video){
        video.incrementViews();
        videoRepository.save(video);
    }
    public VideoDto.VideoResponse toggleReaction(UserEntity user,String videoId,boolean isLike){
        VideoEntity video = findVideoById(videoId);
        Optional<VideoLikesEntity> existsLike = videoLikesRepository.findByUserIdAndVideoId(user.getId(), videoId);
        if (existsLike.isPresent()){
            VideoLikesEntity likesEntity = existsLike.get();
            if (likesEntity.isLike() == isLike){
                videoLikesRepository.delete(likesEntity);
                if (isLike){
                    video.decrementLikes();
                } else {
                    video.decrementDislikes();
                }
            } else {
                likesEntity.setLike(isLike);
                videoLikesRepository.save(likesEntity);

                if (isLike){
                    video.incrementLikes();
                    video.decrementDislikes();
                } else {
                    video.incrementDisLikes();
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

            if (isLike){
                video.incrementLikes();
            } else {
                video.incrementDisLikes();
            }
        }
        videoRepository.save(video);
        return VideoDto.VideoResponse.from(video);
    }
    public Page<VideoDto.VideoResponse> searchVideos(String query, int page, int size) {
        if (query == null || query.trim().isEmpty()) {
            return Page.empty();
        }

        TextCriteria criteria = TextCriteria.forDefaultLanguage()
                .matchingAny(query.trim().split("\\s+"));

        // Natijalarni "score" (moslik reytingi) bo'yicha kamayish tartibida saralash
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "score")
        );

        Page<VideoEntity> videoPage = videoRepository.findAllBy(criteria, pageable);

        return videoPage.map(VideoDto.VideoResponse::from);
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

        Page<VideoDto.VideoResponse> dtoPage = videoPage.map(VideoDto.VideoResponse::from);
        return PageResponse.from(dtoPage);
    }
}
