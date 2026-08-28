package com.youtube.backend.controller;

import com.youtube.backend.dto.UserDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto.UserResponse> getCurrentUser(@AuthenticationPrincipal UserEntity user) {
        return ResponseEntity.ok(userService.getCurrentUserProfile(user));
    }

    @PatchMapping("/password")
    public ResponseEntity<String> updatePassword(
            @AuthenticationPrincipal UserEntity user,
            @Valid @RequestBody UserDto.UpdatePasswordRequest request
    ) {
        userService.updatePassword(user, request);
        return ResponseEntity.ok("Parol muvaffaqiyatli yangilandi");
    }
}