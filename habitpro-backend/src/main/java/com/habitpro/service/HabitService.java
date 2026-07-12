package com.habitpro.service;

import com.habitpro.dto.HabitDTO;
import com.habitpro.entity.Habit;
import com.habitpro.entity.User;
import com.habitpro.repository.HabitRepository;
import com.habitpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Habit> getMyHabits() {
        return habitRepository.findByUserIdAndIsActiveTrue(getCurrentUser().getId());
    }

    public Habit createHabit(HabitDTO dto) {
        User user = getCurrentUser();
        Habit habit = Habit.builder()
                .user(user)
                .title(dto.getTitle())
                .category(dto.getCategory() != null ? dto.getCategory() : "general")
                .frequency(dto.getFrequency() != null ?
                        Habit.Frequency.valueOf(dto.getFrequency()) : Habit.Frequency.daily)
                .icon(dto.getIcon() != null ? dto.getIcon() : "star")
                .color(dto.getColor() != null ? dto.getColor() : "#5C4EE5")
                .isActive(true)
                .build();
        return habitRepository.save(habit);
    }

    public Habit updateHabit(Long id, HabitDTO dto) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
        if (dto.getTitle() != null) habit.setTitle(dto.getTitle());
        if (dto.getCategory() != null) habit.setCategory(dto.getCategory());
        if (dto.getIcon() != null) habit.setIcon(dto.getIcon());
        if (dto.getColor() != null) habit.setColor(dto.getColor());
        return habitRepository.save(habit);
    }

    public void deleteHabit(Long id) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
        habit.setIsActive(false);
        habitRepository.save(habit);
    }
}