package com.youtube.backend.service;

import com.youtube.backend.dto.ChannelDto;
import com.youtube.backend.entity.ChannelEntity;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.VideoEntity;
import com.youtube.backend.exception.CustomBadRequestException;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.ChannelRepository;
import com.youtube.backend.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ChannelService {
    private final ChannelRepository channelRepository;
    private final VideoRepository videoRepository;

    public ChannelDto.ChannelResponse createChannel(UserEntity user, ChannelDto.ChannelRequest request){
        ChannelEntity channel = new ChannelEntity();
        channel.setName(request.getName());
        channel.setUserId(user.getId());
        channel.setVideos(new ArrayList<>());
        channelRepository.save(channel);
        return ChannelDto.ChannelResponse.from(channel,user);
    }
    public ChannelEntity getChannel(UserEntity user){
        return channelRepository.findByUserId(user.getId())
                .orElseThrow(()-> new CustomNotFoundException("Channel not found: " + user.getId()));
    }
    public ChannelDto.ChannelResponse addVideoToChannel(UserEntity user,String videoId){
        VideoEntity video = videoRepository.findById(videoId).orElseThrow(()-> new CustomNotFoundException("Video not found: " + videoId));
        if (!user.getId().equals(video.getUserId())){
            throw new CustomBadRequestException("Only the video author can add the video to the channel");}
        ChannelEntity channel = getChannel(user);
        if (channel.getVideos().stream().anyMatch(v->v.getId().equals(videoId))){
            throw new CustomBadRequestException("Video already exists in channel");
        }
        channel.getVideos().add(video);
        channelRepository.save(channel);
        return ChannelDto.ChannelResponse.from(channel,user);
    }
    public ChannelDto.ChannelResponse removeVideoFromChannel(UserEntity user,String videoId){
        VideoEntity video = videoRepository.findById(videoId).orElseThrow(()-> new CustomNotFoundException("Video not found: " + videoId));
        if (!user.getId().equals(video.getUserId())){
            throw new CustomBadRequestException("Only the video author can remove the video from channel");}
        ChannelEntity channel = getChannel(user);
        channel.getVideos().remove(video);
        channelRepository.save(channel);
        return ChannelDto.ChannelResponse.from(channel,user);
    }
}
