package com.habitpro.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class GoalDTO {
    private String title;
    private Long habitId;
    private Integer targetValue;
    private String unit;
    private LocalDate deadline;
}