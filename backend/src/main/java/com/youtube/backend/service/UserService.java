package com.youtube.backend.service;

import com.youtube.backend.dto.UserDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.exception.CustomBadRequestException;
import com.youtube.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto.UserResponse getCurrentUserProfile(UserEntity user) {
        return UserDto.UserResponse.from(user);
    }

    public void updatePassword(UserEntity user, UserDto.UpdatePasswordRequest request) {
        if (user == null || user.getPassword() == null) {
            throw new CustomBadRequestException("Foydalanuvchi ma'lumotlari topilmadi");
        }

        // 1. Joriy parol to'g'riligini tekshirish
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new CustomBadRequestException("Joriy parol noto'g'ri kiritildi");
        }

        // 2. Yangi parol va uni tasdiqlash mosligini tekshirish
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new CustomBadRequestException("Yangi parollar bir-biriga mos kelmadi");
        }

        // 3. Yangi parolni shifrlab (encode) bazaga saqlash
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}