package com.youtube.backend.util;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CookieUtil {
    @Value("${jwt.refresh_time}")
    private int refreshTime;
    @Value("${cookie.secure}")
    private boolean cookieSecure;

    private void cookieManaging(String refreshToken,int expiration, HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie
                .from("refreshToken",refreshToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofMillis(expiration))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE,cookie.toString());
    }
    public void addTokenToCookie(String refreshToken,HttpServletResponse response){
        cookieManaging(refreshToken,refreshTime,response);
    }
    public void clearTokenFromCookie(HttpServletResponse response){
        cookieManaging(null,0,response);
    }
}
