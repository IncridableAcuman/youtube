package com.youtube.backend.service;

import com.youtube.backend.dto.UserDto;
import com.youtube.backend.entity.UserEntity;
import com.youtube.backend.exception.CustomNotFoundException;
import com.youtube.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final UserRepository userRepository;

    public List<UserDto.UserResponse> getUserList(){
        List<UserEntity> users = userRepository.findAll();
        return users
                .stream()
                .map(UserDto.UserResponse::from).toList();
    }
    public void removeUser(String id){
        UserEntity user = userRepository.findById(id).orElseThrow(()-> new CustomNotFoundException("User not found"));
        userRepository.delete(user);
    }
}
