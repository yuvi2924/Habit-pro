package com.habitpro.controller;

import com.habitpro.dto.FriendDTO;
import com.habitpro.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/request/{username}")
    public ResponseEntity<String> sendRequest(@PathVariable String username) {
        return ResponseEntity.ok(friendService.sendRequest(username));
    }

    @PutMapping("/respond/{friendshipId}")
    public ResponseEntity<String> respond(@PathVariable Long friendshipId,
                                          @RequestParam boolean accept) {
        return ResponseEntity.ok(friendService.respondToRequest(friendshipId, accept));
    }

    @GetMapping
    public ResponseEntity<List<FriendDTO>> getMyFriends() {
        return ResponseEntity.ok(friendService.getMyFriends());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FriendDTO>> getPending() {
        return ResponseEntity.ok(friendService.getPendingRequests());
    }

    @GetMapping("/progress/{friendId}")
    public ResponseEntity<FriendDTO> getFriendProgress(@PathVariable Long friendId) {
        return ResponseEntity.ok(friendService.getFriendProgress(friendId));
    }
}