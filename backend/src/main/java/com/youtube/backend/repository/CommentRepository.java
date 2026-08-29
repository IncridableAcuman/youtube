package com.youtube.backend.repository;

import com.youtube.backend.entity.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository; // Nemki JPA bo'lsa JpaRepository

public interface CommentRepository extends MongoRepository<CommentEntity, String> {
    Page<CommentEntity> findByVideoId(String videoId, Pageable pageable);
}