package com.habitpro.controller;

import com.habitpro.entity.Streak;
import com.habitpro.entity.User;
import com.habitpro.repository.UserRepository;
import com.habitpro.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final StreakService streakService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe() {
        return ResponseEntity.ok(getCurrentUser());
    }

    @GetMapping("/streaks")
    public ResponseEntity<List<Streak>> getMyStreaks() {
        User user = getCurrentUser();
        return ResponseEntity.ok(streakService.getUserStreaks(user.getId()));
    }
}