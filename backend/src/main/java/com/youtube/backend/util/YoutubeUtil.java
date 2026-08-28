package com.youtube.backend.util;

import com.youtube.backend.exception.CustomBadRequestException;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class YoutubeUtil {
    private static final String YOUTUBE_REGEX =
            "^.*(youtu\\.be/|v/|u/\\w/|embed/|shorts/|watch\\?v=|&v=)([^#&?]*).*";

    public String extractVideoId(String url) {
        if (url == null || url.trim().isEmpty()) {
            throw new CustomBadRequestException("URL is null or empty");
        }
        Pattern pattern = Pattern.compile(YOUTUBE_REGEX, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(url);
        if (matcher.matches() && matcher.group(2).length() == 11) {
            return matcher.group(2);
        }
        return null;
    }
}