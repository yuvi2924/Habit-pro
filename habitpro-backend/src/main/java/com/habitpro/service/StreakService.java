package com.habitpro.service;

import com.habitpro.entity.Habit;
import com.habitpro.entity.Streak;
import com.habitpro.entity.User;
import com.habitpro.repository.StreakRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final StreakRepository streakRepository;

    public Streak updateStreak(User user, Habit habit) {
        Streak streak = streakRepository
                .findByUserIdAndHabitId(user.getId(), habit.getId())
                .orElse(Streak.builder()
                        .user(user)
                        .habit(habit)
                        .currentStreak(0)
                        .longestStreak(0)
                        .build());

        LocalDate today = LocalDate.now();
        LocalDate last = streak.getLastActiveDate();

        if (last == null || last.isBefore(today.minusDays(1))) {
            streak.setCurrentStreak(1);
        } else if (last.equals(today.minusDays(1))) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
        }

        if (streak.getCurrentStreak() > streak.getLongestStreak()) {
            streak.setLongestStreak(streak.getCurrentStreak());
        }

        streak.setLastActiveDate(today);
        return streakRepository.save(streak);
    }

    public List<Streak> getUserStreaks(Long userId) {
        return streakRepository.findByUserIdOrderByCurrentStreakDesc(userId);
    }
}