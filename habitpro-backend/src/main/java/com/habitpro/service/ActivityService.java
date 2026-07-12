package com.habitpro.service;

import com.habitpro.dto.ActivityDTO;
import com.habitpro.entity.ActivityLog;
import com.habitpro.entity.Habit;
import com.habitpro.entity.User;
import com.habitpro.repository.ActivityLogRepository;
import com.habitpro.repository.HabitRepository;
import com.habitpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityLogRepository activityLogRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final StreakService streakService;
    private final PointsService pointsService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ActivityLog logActivity(ActivityDTO dto) {
        User user = getCurrentUser();
        Habit habit = habitRepository.findById(dto.getHabitId())
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        LocalDate date = dto.getLogDate() != null ? dto.getLogDate() : LocalDate.now();

        ActivityLog log = activityLogRepository
                .findByUserIdAndHabitIdAndLogDate(user.getId(), habit.getId(), date)
                .orElse(ActivityLog.builder()
                        .user(user)
                        .habit(habit)
                        .logDate(date)
                        .build());

        log.setCompleted(true);
        log.setValue(dto.getValue() != null ? dto.getValue() : 1);
        log.setNote(dto.getNote());
        activityLogRepository.save(log);

        streakService.updateStreak(user, habit);
        pointsService.awardPoints(user, habit, 10, "Completed habit: " + habit.getTitle());

        return log;
    }

    public List<ActivityLog> getMyActivities(LocalDate from, LocalDate to) {
        User user = getCurrentUser();
        return activityLogRepository.findByUserIdAndLogDateBetween(
                user.getId(),
                from != null ? from : LocalDate.now().minusDays(30),
                to != null ? to : LocalDate.now()
        );
    }
}