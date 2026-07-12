package com.habitpro.dto;

import lombok.Data;

@Data
public class HabitDTO {
    private String title;
    private String category;
    private String frequency;
    private String icon;
    private String color;
}