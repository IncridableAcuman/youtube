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

    public UserDto.UserRequest getCurrentUserProfile(UserEntity user) {
        return UserDto.UserRequest.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .build();
    }
    public void updatePassword(UserEntity user,UserDto.UpdatePasswordRequest request){
        if (user.getPassword() == null){
            throw new CustomBadRequestException("User is null");}
        if (!passwordEncoder.matches(request.getNewPassword(),user.getPassword()) || !request.getNewPassword().equals(request.getConfirmNewPassword())){
            throw new CustomBadRequestException("Password does not match");}
        user.setPassword(request.getNewPassword());
        userRepository.save(user);

    }
}
