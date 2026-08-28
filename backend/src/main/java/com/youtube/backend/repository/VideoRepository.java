package com.youtube.backend.repository;

import com.youtube.backend.entity.VideoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends MongoRepository<VideoEntity,String> {
    List<VideoEntity> findByUserId(String userId);
    boolean existsByYoutubeKey(String youtubeKey);
}
