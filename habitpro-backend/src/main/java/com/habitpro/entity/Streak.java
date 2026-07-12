package com.habitpro.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "streaks",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","habit_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Streak {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @Column(nullable = false)
    private Integer currentStreak = 0;

    @Column(nullable = false)
    private Integer longestStreak = 0;

    private LocalDate lastActiveDate;
    private LocalDateTime updatedAt;

    @PreUpdate @PrePersist
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}