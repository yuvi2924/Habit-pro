package com.habitpro.repository;

import com.habitpro.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserIdAndLogDateBetween(Long userId, LocalDate from, LocalDate to);
    Optional<ActivityLog> findByUserIdAndHabitIdAndLogDate(Long userId, Long habitId, LocalDate date);
    List<ActivityLog> findByHabitIdOrderByLogDateDesc(Long habitId);
}