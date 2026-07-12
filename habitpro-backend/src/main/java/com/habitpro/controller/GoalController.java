package com.habitpro.controller;

import com.habitpro.dto.GoalDTO;
import com.habitpro.entity.Goal;
import com.habitpro.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public ResponseEntity<List<Goal>> getGoals() {
        return ResponseEntity.ok(goalService.getMyGoals());
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody GoalDTO dto) {
        return ResponseEntity.ok(goalService.createGoal(dto));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<Goal> updateProgress(@PathVariable Long id,
                                               @RequestParam int value) {
        return ResponseEntity.ok(goalService.updateProgress(id, value));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok("Goal deleted");
    }
}