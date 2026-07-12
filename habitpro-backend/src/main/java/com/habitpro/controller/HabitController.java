package com.habitpro.controller;

import com.habitpro.dto.HabitDTO;
import com.habitpro.entity.Habit;
import com.habitpro.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class HabitController {

    private final HabitService habitService;

    @GetMapping
    public ResponseEntity<List<Habit>> getHabits() {
        return ResponseEntity.ok(habitService.getMyHabits());
    }

    @PostMapping
    public ResponseEntity<Habit> createHabit(@RequestBody HabitDTO dto) {
        return ResponseEntity.ok(habitService.createHabit(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable Long id, @RequestBody HabitDTO dto) {
        return ResponseEntity.ok(habitService.updateHabit(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.ok("Habit deleted");
    }
}