package com.youtube.backend.repository;

import com.youtube.backend.entity.VideoLikesEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VideoLikesRepository extends MongoRepository<VideoLikesEntity,String> {
    Optional<VideoLikesEntity> findByUserIdAndVideoId(String userId,String videoId);
}
