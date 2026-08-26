package com.youtube.backend.service;

import com.youtube.backend.dto.VideoDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.VideoEntity;
import com.youtube.backend.exception.CustomBadRequestException;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepository;

    public VideoDto.VideoResponse addVideo(UserEntity user,VideoDto.VideoRequest request){
        VideoEntity video = new VideoEntity();
        video.setAuthorId(user.getId());
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setYoutubeUrl(request.getYoutubeUrl());
        video.setYoutubeKey(request.getYoutubeKey());
        videoRepository.save(video);
        return VideoDto.VideoResponse.from(video);
    }
    public VideoDto.VideoResponse getVideo(String id){
        VideoEntity video = findVideoById(id);
        return VideoDto.VideoResponse.from(video);
    }
    public List<VideoDto.VideoResponse> getList(UserEntity user){
        List<VideoEntity> list = videoRepository.findByAuthorId(user.getId());
        return list
                .stream()
                .map(VideoDto.VideoResponse::from).toList();
    }
    public VideoDto.VideoResponse editVideo(UserEntity user,String id,VideoDto.VideoRequest request){
        VideoEntity video = findVideoById(id);
        if (!video.getAuthorId().equals(user.getId())){
            throw new CustomBadRequestException("Only author can edit this video");}
        Optional.ofNullable(request.getTitle()).ifPresent(video::setTitle);
        Optional.ofNullable(request.getDescription()).ifPresent(video::setDescription);
        Optional.ofNullable(request.getYoutubeUrl()).ifPresent(video::setYoutubeUrl);
        Optional.ofNullable(request.getYoutubeKey()).ifPresent(video::setYoutubeKey);
        videoRepository.save(video);
        return VideoDto.VideoResponse.from(video);
    }
    public void removeVideo(UserEntity user,String id){
        VideoEntity video = findVideoById(id);
        if (!video.getAuthorId().equals(user.getId())){
            throw new CustomBadRequestException("Only author can edit this video");}
        videoRepository.delete(video);
    }
    public VideoEntity findVideoById(String id){
        return videoRepository.findById(id).orElseThrow(()-> new CustomNotFoundException("Video not found"));
    }
}
