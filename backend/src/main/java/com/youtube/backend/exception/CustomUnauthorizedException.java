package com.youtube.backend.exception;

public class CustomUnauthorizedException extends RuntimeException {
    public CustomUnauthorizedException(String message){
        super(message);
    }
}
