package com.youtube.backend.repository;

import com.youtube.backend.entity.ChannelEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChannelRepository extends MongoRepository<ChannelEntity,String> {

}
