package com.habitpro.controller;

import com.habitpro.dto.ActivityDTO;
import com.habitpro.entity.ActivityLog;
import com.habitpro.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityLog> logActivity(@RequestBody ActivityDTO dto) {
        return ResponseEntity.ok(activityService.logActivity(dto));
    }

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getActivities(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(activityService.getMyActivities(from, to));
    }
}