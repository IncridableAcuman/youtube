package com.youtube.backend.repository;

import com.youtube.backend.entity.VideoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends MongoRepository<VideoEntity,String> {
    List<VideoEntity> findByUserId(String userId);
    boolean existsByYoutubeKey(String youtubeKey);
    List<VideoEntity> findByChannelId(String channelId);
    // TextCriteria bo'yicha avtomatik full-text search va pagination
    Page<VideoEntity> findAllBy(TextCriteria criteria, Pageable pageable);
    Page<VideoEntity> findAll(Pageable pageable);
}
