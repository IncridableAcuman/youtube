package com.youtube.backend.dto;

import java.util.List;

public class AdminDashboardDto {

    public record DashboardStatsResponse(
            long totalUsers,
            long totalVideos,
            long totalViews,
            long totalLikes,
            List<DailyStat> userRegistrations,
            List<DailyStat> videoUploads
    ) {}

    public record DailyStat(
            String date,
            long count
    ) {}
}