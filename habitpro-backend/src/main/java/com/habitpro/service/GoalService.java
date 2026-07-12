package com.habitpro.service;

import com.habitpro.dto.GoalDTO;
import com.habitpro.entity.Goal;
import com.habitpro.entity.Habit;
import com.habitpro.entity.User;
import com.habitpro.repository.GoalRepository;
import com.habitpro.repository.HabitRepository;
import com.habitpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Goal> getMyGoals() {
        return goalRepository.findByUserId(getCurrentUser().getId());
    }

    public Goal createGoal(GoalDTO dto) {
        User user = getCurrentUser();
        Habit habit = null;
        if (dto.getHabitId() != null) {
            habit = habitRepository.findById(dto.getHabitId()).orElse(null);
        }
        Goal goal = Goal.builder()
                .user(user)
                .habit(habit)
                .title(dto.getTitle())
                .targetValue(dto.getTargetValue() != null ? dto.getTargetValue() : 1)
                .currentValue(0)
                .unit(dto.getUnit() != null ? dto.getUnit() : "times")
                .deadline(dto.getDeadline())
                .isCompleted(false)
                .build();
        return goalRepository.save(goal);
    }

    public Goal updateProgress(Long goalId, int value) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        goal.setCurrentValue(goal.getCurrentValue() + value);
        if (goal.getCurrentValue() >= goal.getTargetValue()) {
            goal.setIsCompleted(true);
        }
        return goalRepository.save(goal);
    }

    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}