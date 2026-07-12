package com.habitpro.repository;

import com.habitpro.entity.Streak;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StreakRepository extends JpaRepository<Streak, Long> {
    Optional<Streak> findByUserIdAndHabitId(Long userId, Long habitId);
    List<Streak> findByUserIdOrderByCurrentStreakDesc(Long userId);
}