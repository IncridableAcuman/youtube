package com.youtube.backend.config;

import com.youtube.backend.service.UserDetailsServiceImpl;
import com.youtube.backend.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        String token = null;
        String email = null;

        // Token mavjudligi va to'g'ri JWT formati (kamida 2 ta nuqta borligi) tekshiriladi
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String extractedToken = header.substring(7).trim();

            if (StringUtils.hasText(extractedToken)
                    && !extractedToken.equals("undefined")
                    && !extractedToken.equals("null")
                    && extractedToken.split("\\.").length == 3) {
                token = extractedToken;
                try {
                    email = jwtUtil.extractSubject(token);
                } catch (ExpiredJwtException e) {
                    log.warn("JWT token muddati o'tgan: {}", e.getMessage());
                } catch (JwtException e) {
                    log.warn("Yaroqsiz JWT token: {}", e.getMessage());
                }
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            if (jwtUtil.validateToken(token)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}