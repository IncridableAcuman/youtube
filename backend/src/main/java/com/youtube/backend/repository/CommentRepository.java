package com.youtube.backend.repository;

import com.youtube.backend.entity.CommentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentRepository extends MongoRepository<CommentEntity,String> {
    Optional<CommentEntity> findByVideoId(String videoId);
}
