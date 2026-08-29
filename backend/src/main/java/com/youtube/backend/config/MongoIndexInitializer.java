package com.youtube.backend.config;

import com.youtube.backend.entity.VideoEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MongoIndexInitializer {

    private final MongoTemplate mongoTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void initIndexes() {
        try {
            TextIndexDefinition textIndex = new TextIndexDefinition.TextIndexDefinitionBuilder()
                    .onField("title", 3f)
                    .onField("tags", 2f)
                    .onField("description", 1f)
                    .build();

            mongoTemplate.indexOps(VideoEntity.class).createIndex(textIndex);
            log.info("VideoEntity uchun Text Index muvaffaqiyatli yaratildi.");
        } catch (Exception e) {
            log.error("MongoDB Text Index yaratishda xatolik: {}", e.getMessage());
        }
    }
}