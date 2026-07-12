package com.habitpro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardDTO {
    private Long id;
    private String username;
    private Integer totalXp;
    private Integer level;
    private String type;
}