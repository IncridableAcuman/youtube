package com.youtube.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.youtube.backend.dto.PageResponse;
import com.youtube.backend.dto.UserDto;
import com.youtube.backend.entity.enums.Role;
import com.youtube.backend.service.AdminUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
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

    @PatchMapping("/{id}/toggle-ban")
    public ResponseEntity<UserDto.UserResponse> toggleUserBan(@PathVariable String id) {
        return ResponseEntity.ok(adminUserService.toggleUserBan(id));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserDto.UserResponse> changeUserRole(
            @PathVariable String id,
            @RequestParam Role role
    ) {
        return ResponseEntity.ok(adminUserService.changeUserRole(id, role));
    }
}