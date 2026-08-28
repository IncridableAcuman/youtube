package com.youtube.backend.service;

import com.youtube.backend.dto.ChannelDto;
import com.youtube.backend.dto.VideoDto;
import com.youtube.backend.entity.ChannelEntity;
import com.youtube.backend.entity.ChannelSubscriptionEntity;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.VideoEntity;
import com.youtube.backend.exception.CustomBadRequestException;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.ChannelRepository;
import com.youtube.backend.repository.ChannelSubscriptionRepository;
import com.youtube.backend.repository.UserRepository;
import com.youtube.backend.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChannelService {
    private final ChannelRepository channelRepository;
    private final VideoRepository videoRepository;
    private final ChannelSubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public ChannelDto.ChannelResponse createChannel(UserEntity user, ChannelDto.ChannelRequest request) {
        if (channelRepository.findByUserId(user.getId()).isPresent()) {
            throw new CustomBadRequestException("User channel already exist");
        }

        ChannelEntity channel = new ChannelEntity();
        channel.setName(request.getName());
        channel.setDescription(request.getDescription());
        channel.setHandle(request.getHandle());
        channel.setUserId(user.getId());
        channelRepository.save(channel);

        return ChannelDto.ChannelResponse.from(channel, user);
    }

    public ChannelEntity getChannelByUserId(String userId) {
        return channelRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomNotFoundException("Channel not found for user: " + userId));
    }

    public ChannelDto.ChannelResponse getMyChannel(UserEntity user) {
        ChannelEntity channel = getChannelByUserId(user.getId());
        return ChannelDto.ChannelResponse.from(channel, user);
    }

    public ChannelDto.ChannelResponse getChannelDetails(String channelId, UserEntity currentUser) {
        ChannelEntity channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new CustomNotFoundException("Channel not found: " + channelId));

        UserEntity author = userRepository.findById(channel.getUserId())
                .orElseThrow(() -> new CustomNotFoundException("Channel author not found"));

        boolean isSubscribed = currentUser != null &&
                subscriptionRepository.existsBySubscriberUserIdAndChannelId(currentUser.getId(), channelId);

        return ChannelDto.ChannelResponse.from(channel, author, isSubscribed);
    }

    public void assignVideoToChannel(UserEntity user, String videoId) {
        VideoEntity video = videoRepository.findById(videoId)
                .orElseThrow(() -> new CustomNotFoundException("Video not found: " + videoId));

        if (!user.getId().equals(video.getUserId())) {
            throw new CustomBadRequestException("Only the author of the video can attach it to the channel!");
        }

        ChannelEntity channel = getChannelByUserId(user.getId());
        video.setChannelId(channel.getId());
        videoRepository.save(video);
    }

    public List<VideoDto.VideoResponse> getChannelVideos(String channelId) {
        ChannelEntity channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new CustomNotFoundException("Channel not found: " + channelId));

        List<VideoEntity> videos = videoRepository.findByChannelId(channelId);

        return videos.stream()
                .map(video -> VideoDto.VideoResponse.from(video, channel.getName()))
                .toList();
    }

    @Transactional
    public boolean toggleSubscription(UserEntity user, String channelId) {
        ChannelEntity channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new CustomNotFoundException("Channel not found: " + channelId));

        if (channel.getUserId().equals(user.getId())) {
            throw new CustomBadRequestException("You can't subscribe to your own channel!");
        }

        Optional<ChannelSubscriptionEntity> existingSub =
                subscriptionRepository.findBySubscriberUserIdAndChannelId(user.getId(), channelId);

        if (existingSub.isPresent()) {
            subscriptionRepository.delete(existingSub.get());
            channel.decrementSubscribers();
            channelRepository.save(channel);
            return false;
        } else {
            ChannelSubscriptionEntity subscription = new ChannelSubscriptionEntity();
            subscription.setSubscriberUserId(user.getId());
            subscription.setChannelId(channelId);
            subscriptionRepository.save(subscription);

            channel.incrementSubscribers();
            channelRepository.save(channel);
            return true;
        }
    }

    public boolean isSubscribed(String userId, String channelId) {
        return subscriptionRepository.existsBySubscriberUserIdAndChannelId(userId, channelId);
    }
}