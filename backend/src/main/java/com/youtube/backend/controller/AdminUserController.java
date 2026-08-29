package com.youtube.backend.controller;

import com.youtube.backend.dto.PageResponse;
import com.youtube.backend.dto.UserDto;
import com.youtube.backend.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Tirnoq belgilari qo'shildi
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<PageResponse<UserDto.UserResponse>> getUserList(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminUserService.getUserList(query, page, size));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeUser(@PathVariable String id) {
        adminUserService.removeUser(id);
        return ResponseEntity.noContent().build();
    }
}