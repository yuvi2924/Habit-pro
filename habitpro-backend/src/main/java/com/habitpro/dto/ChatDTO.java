package com.habitpro.dto;

import lombok.Data;

@Data
public class ChatDTO {
    private Long receiverId;
    private String message;
}