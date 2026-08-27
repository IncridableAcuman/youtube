package com.youtube.backend.repository;

import com.youtube.backend.entity.VideoLikesEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoLikesRepository extends MongoRepository<VideoLikesEntity,String> {

}
