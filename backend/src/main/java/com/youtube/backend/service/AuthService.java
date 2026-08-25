package com.youtube.backend.service;

import com.youtube.backend.dto.AuthDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.enums.Role;
import com.youtube.backend.exception.CustomBadRequestException;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.exception.CustomUnauthorizedException;
import com.youtube.backend.repository.UserRepository;
import com.youtube.backend.util.CookieUtil;
import com.youtube.backend.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final PasswordEncoder passwordEncoder;
    TokenService tokenService;


    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request,HttpServletResponse response) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomBadRequestException("Bu email allaqachon band qilingan");}
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CustomBadRequestException("Bu username allaqachon band qilingan");}
        UserEntity user = new UserEntity();
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setEnabled(false);
        userRepository.save(user);
        return authResponse(user,response);
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request, HttpServletResponse response) {
        UserEntity user = findUserByEmail(request.getEmail());
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomUnauthorizedException("Parol noto'g'ri");}
        return authResponse(user, response);
    }

    public void logout(String refreshToken, HttpServletResponse response) {
        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            throw new CustomUnauthorizedException("Token yaroqsiz yoki mavjud emas");}
        UserEntity user = getUserFromToken(refreshToken);
        tokenService.removeToken(user.getId());
        cookieUtil.clearTokenFromCookie(response);
    }

    public AuthDto.AuthResponse refresh(String refreshToken, HttpServletResponse response) {
        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            throw new CustomUnauthorizedException("Token yaroqsiz yoki muddati o'tgan");}
        UserEntity user = getUserFromToken(refreshToken);
        return authResponse(user, response);
    }

    public AuthDto.AuthResponse authResponse(UserEntity user, HttpServletResponse response) {
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        tokenService.saveToken(user.getId(), refreshToken);
        cookieUtil.addTokenToCookie(refreshToken, response);
        return AuthDto.AuthResponse.from(accessToken, user.getId());
    }

    public UserEntity findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi"));
    }

    public UserEntity getUserFromToken(String token) {
        String email = jwtUtil.extractSubject(token);
        return findUserByEmail(email);
    }
}
