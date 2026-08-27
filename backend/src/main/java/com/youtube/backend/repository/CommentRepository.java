package com.youtube.backend.repository;

import com.youtube.backend.entity.CommentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<CommentEntity,String> {
    List<CommentEntity> findByVideoIdOrderByCreatedAtDesc(String videoId);
}
