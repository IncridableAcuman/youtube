package com.youtube.backend.service;


import com.youtube.backend.dto.UserDto;
import com.youtube.backend.entity.UserEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public UserDto getCurrentUserProfile(UserEntity user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole() != null ? user.getRole().name() : "USER")
                .build();
    }
}
