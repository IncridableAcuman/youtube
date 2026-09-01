package com.youtube.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.youtube.backend.dto.PageResponse;
import com.youtube.backend.dto.UserDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.enums.Role;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final UserRepository userRepository;

    public PageResponse<UserDto.UserResponse> getUserList(String query, int page, int size) {
        // "createdAt" o'rniga "id" bo'yicha saralash o'rnatildi (MongoDB ObjectId o'zi vaqt tartibida yaratiladi)
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<UserEntity> usersPage;
        if (StringUtils.hasText(query)) {
            usersPage = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        Page<UserDto.UserResponse> dtoPage = usersPage.map(UserDto.UserResponse::from);
        return PageResponse.from(dtoPage);
    }

    public void removeUser(String id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi: " + id));
        userRepository.delete(user);
    }

    // Foydalanuvchini bloklash / blokdan chiqarish (enabled maydonini almashtirish)
    public UserDto.UserResponse toggleUserBan(String id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi: " + id));
        
        user.setEnabled(!user.isEnabled()); // enabled statusini teskarisiga o'zgartirish
        userRepository.save(user);
        
        return UserDto.UserResponse.from(user);
    }

    // Foydalanuvchi rolini o'zgartirish (USER, MODERATOR, ADMIN)
    public UserDto.UserResponse changeUserRole(String id, Role newRole) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi: " + id));
        
        user.setRole(newRole);
        userRepository.save(user);
        
        return UserDto.UserResponse.from(user);
    }
}