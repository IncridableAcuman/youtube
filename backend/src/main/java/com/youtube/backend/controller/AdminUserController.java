package com.youtube.backend.controller;

import com.youtube.backend.dto.UserDto;
import com.youtube.backend.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole(ADMIN)")
public class AdminUserController {
    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<UserDto.UserResponse>> getUserList(){
        return ResponseEntity.ok(adminUserService.getUserList());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeUser(@PathVariable String id){
        adminUserService.removeUser(id);
        return ResponseEntity.ok("User removed");
    }
}
