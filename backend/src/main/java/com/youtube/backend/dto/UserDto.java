package com.youtube.backend.dto;

import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.entity.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class UserDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserRequest{
        private String id;
        private String fullName;
        private String username;
        private String email;
        private String avatar;
        private Role role;
    }
    public record UserResponse(
            String id,
            String fullName,
            String username,
            String email,
            String avatar,
            Role role
    ){
        public static UserResponse from(UserEntity user){
            return new UserResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getAvatar(),
                    user.getRole()
            );
        }
    }

    @Data
    public static class UpdatePasswordRequest {
        @NotBlank private String currentPassword;
        @NotBlank private String newPassword;
        @NotBlank private String  confirmNewPassword;
    }
}