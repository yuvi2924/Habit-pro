package com.habitpro.service;

import com.habitpro.entity.Habit;
import com.habitpro.entity.Points;
import com.habitpro.entity.User;
import com.habitpro.repository.PointsRepository;
import com.habitpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PointsService {

    private final PointsRepository pointsRepository;
    private final UserRepository userRepository;

    public Points awardPoints(User user, Habit habit, int xp, String reason) {
        Points points = Points.builder()
                .user(user)
                .habit(habit)
                .xpEarned(xp)
                .reason(reason)
                .build();
        pointsRepository.save(points);

        user.setTotalXp(user.getTotalXp() + xp);
        user.setLevel(calculateLevel(user.getTotalXp()));
        userRepository.save(user);

        return points;
    }

    private int calculateLevel(int totalXp) {
        if (totalXp < 100) return 1;
        if (totalXp < 300) return 2;
        if (totalXp < 600) return 3;
        if (totalXp < 1000) return 4;
        if (totalXp < 1500) return 5;
        if (totalXp < 2500) return 6;
        if (totalXp < 4000) return 7;
        if (totalXp < 6000) return 8;
        if (totalXp < 9000) return 9;
        return 10;
    }

    public Integer getTotalXp(Long userId) {
        Integer xp = pointsRepository.getTotalXpByUserId(userId);
        return xp != null ? xp : 0;
    }
}