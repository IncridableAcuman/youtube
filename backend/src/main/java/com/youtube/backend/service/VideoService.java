package com.youtube.backend.service;

import com.youtube.backend.dto.VideoDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.VideoEntity;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
        VideoEntity video = videoRepository.findById(id).orElseThrow(()-> new CustomNotFoundException("Video not found"));
        return VideoDto.VideoResponse.from(video);
    }
    public List<VideoDto.VideoResponse> getList(UserEntity user){
        List<VideoEntity> list = videoRepository.findByAuthorId(user.getId());
        return list
                .stream()
                .map(VideoDto.VideoResponse::from).toList();
    }
}
