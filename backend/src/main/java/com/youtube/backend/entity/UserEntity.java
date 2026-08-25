package com.youtube.backend.entity;

import com.youtube.backend.entity.enums.Role;
import lombok.*;
import org.jspecify.annotations.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
@Document(collection = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@Builder
public class UserEntity implements UserDetails {
    @Id
    private String  id;

    private String fullName;

    private String username;

    private String email;

    private String password;

    private String avatar;

    private Role role;

    private boolean enabled = false;

    @Override
    public @NonNull Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

}