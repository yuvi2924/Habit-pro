package com.habitpro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FriendDTO {
    private Long id;
    private String username;
    private String email;
    private Integer level;
    private Integer totalXp;
    private String status;
}