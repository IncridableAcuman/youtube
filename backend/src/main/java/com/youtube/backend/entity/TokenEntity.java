package com.youtube.backend.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;

@Document(collation = "tokens")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TokenEntity {
    @Id
    private Long id;

    private String userId;

    private String refreshToken;

    private OffsetDateTime expiryDate;
}