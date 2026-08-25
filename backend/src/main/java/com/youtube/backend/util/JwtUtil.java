package com.youtube.backend.util;

import com.youtube.backend.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.access_time}")
    private long accessTime;
    @Value("${jwt.refresh_time}")
    private long refreshTime;
    private Key key;

    @PostConstruct
    public void init(){
        this.key= Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    private String generateToken(UserEntity user, long tokenExpiration){
        final long currentMillis = System.currentTimeMillis();
        final Date issueAt = new Date(currentMillis);
        final Date expiration = new Date(currentMillis + tokenExpiration);

        Map<String,Object> claims = new HashMap<>();
        claims.put("id",user.getId());
        claims.put("role",user.getRole());

        return Jwts
                .builder()
                .addClaims(claims)
                .setSubject(user.getEmail())
                .signWith(key)
                .setIssuedAt(issueAt)
                .setExpiration(expiration)
                .compact();
    }
    public String generateAccessToken(UserEntity user){
        return generateToken(user,accessTime);
    }
    public String generateRefreshToken(UserEntity user){
        return generateToken(user,refreshTime);
    }
    private Claims extractClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String extractSubject(String token){
        return extractClaims(token).getSubject();
    }
    public Date extractExpiration(String token){
        return extractClaims(token).getExpiration();
    }
    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }
    public boolean validateToken(String token){
        try {
            String subject = extractSubject(token);
            return !isTokenExpired(token) && subject != null;
        } catch (JwtException e){
            return false;
        }
    }
}
