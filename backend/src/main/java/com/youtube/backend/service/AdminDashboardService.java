package com.youtube.backend.service;

import com.youtube.backend.dto.AdminDashboardDto;
import com.youtube.backend.entity.VideoEntity;
import com.youtube.backend.repository.UserRepository;
import com.youtube.backend.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final MongoTemplate mongoTemplate;

    public AdminDashboardDto.DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalVideos = videoRepository.count();

        // MongoDB orqali barcha ko'rishlar va likelarni hisoblash
        Aggregation viewAggregation = Aggregation.newAggregation(
                Aggregation.group().sum("viewCount").as("total")
        );
        AggregationResults<DocumentResult> viewResult = mongoTemplate.aggregate(
                viewAggregation, VideoEntity.class, DocumentResult.class
        );
        long totalViews = viewResult.getUniqueMappedResult() != null
                ? viewResult.getUniqueMappedResult().total() : 0;

        Aggregation likeAggregation = Aggregation.newAggregation(
                Aggregation.group().sum("likeCount").as("total")
        );
        AggregationResults<DocumentResult> likeResult = mongoTemplate.aggregate(
                likeAggregation, VideoEntity.class, DocumentResult.class
        );
        long totalLikes = likeResult.getUniqueMappedResult() != null
                ? likeResult.getUniqueMappedResult().total() : 0;

        return new AdminDashboardDto.DashboardStatsResponse(
                totalUsers,
                totalVideos,
                totalViews,
                totalLikes,
                List.of(), // Grafik uchun kunlik foydalanuvchilar dinamikasi
                List.of()  // Grafik uchun kunlik videolar dinamikasi
        );
    }

    private record DocumentResult(long total) {}
}