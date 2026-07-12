package com.habitpro.controller;

import com.habitpro.dto.LeaderboardDTO;
import com.habitpro.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardDTO>> getGlobal() {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard());
    }

    @GetMapping("/friends")
    public ResponseEntity<List<LeaderboardDTO>> getFriends() {
        return ResponseEntity.ok(leaderboardService.getFriendsLeaderboard());
    }
}