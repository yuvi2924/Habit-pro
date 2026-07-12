package com.habitpro.controller;

import com.habitpro.dto.ChatDTO;
import com.habitpro.entity.ChatMessage;
import com.habitpro.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatDTO dto) {
        return ResponseEntity.ok(chatService.sendMessage(dto));
    }

    @GetMapping("/conversation/{friendId}")
    public ResponseEntity<List<ChatMessage>> getConversation(@PathVariable Long friendId) {
        return ResponseEntity.ok(chatService.getConversation(friendId));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<ChatMessage>> getUnread() {
        return ResponseEntity.ok(chatService.getUnread());
    }
}