package com.youtube.backend.exception;

public class CustomInternalServerErrorException extends RuntimeException{
    public CustomInternalServerErrorException(){
        super("Internal Server Error");
    }
}
