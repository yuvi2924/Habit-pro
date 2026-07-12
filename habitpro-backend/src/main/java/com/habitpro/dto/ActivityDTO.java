package com.habitpro.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ActivityDTO {
    private Long habitId;
    private LocalDate logDate;
    private Integer value;
    private String note;
}