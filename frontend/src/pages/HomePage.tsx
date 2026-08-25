import { useState, useEffect } from "react";
import { CategoryChips } from "@/components/video/CategoryChips";
import { VideoCard } from "@/components/video/VideoCard";
import type {Video} from "@/types/video";
import {api} from "@/api.axio.ts";

// Zaxira uchun namuna videolar (Backend ulanmagan bo'lsa)
const MOCK_VIDEOS: Video[] = [
    {
        id: "1",
        title: "Spring Boot va React yordamida Fullstack Dastur Yaratish",
        youtubeUrl: "https://www.youtube.com/watch?v=hd1PKDTw91Q",
        youtubeId: "hd1PKDTw91Q",
        channelName: "Java Code Uz",
        views: 12400,
        duration: "24:15",
        createdAt: "2 kun avval",
    },
    {
        id: "2",
        title: "TailwindCSS v4.0 Yengi Imkoniyatlari va Amaliyot",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeId: "dQw4w9WgXcQ",
        channelName: "Frontend Community",
        views: 45000,
        duration: "18:40",
        createdAt: "1 hafta avval",
    },
    {
        id: "3",
        title: "TypeScript va React Hook Form bilan Murakkab Formani Boshqarish",
        youtubeUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
        youtubeId: "L_LUpnjgPso",
        channelName: "Web Dev Uz",
        views: 8900,
        duration: "15:02",
        createdAt: "3 kun avval",
    },
    {
        id: "4",
        title: "MongoDB va Spring Data Repository Bilan Ishlash",
        youtubeUrl: "https://www.youtube.com/watch?v=3qBXWUpoPHo",
        youtubeId: "3qBXWUpoPHo",
        channelName: "Backend Master",
        views: 3100,
        duration: "32:10",
        createdAt: "5 kun avval",
    },
];

export default function HomePage() {
    const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);

    useEffect(() => {
        // Backend API mavjud bo'lganda real ma'lumot yuklanadi
        api
            .get("/api/videos")
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setVideos(res.data);
                }
            })
            .catch(() => {
                console.log("Mock ma'lumotlar ishlatilmoqda.");
            });
    }, []);

    return (
        <div className="space-y-6">
            {/* Kategoriyalar filtri */}
            <CategoryChips />

            {/* Video Feed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
}