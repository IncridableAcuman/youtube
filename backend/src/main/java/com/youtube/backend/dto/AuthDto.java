package com.youtube.backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank private String fullName;
        @NotBlank private String username;
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }


    public record AuthResponse(String accessToken, String id) {
        public static AuthResponse from(String accessToken, String id) {
            return new AuthResponse(accessToken, id);
        }
    }
}
