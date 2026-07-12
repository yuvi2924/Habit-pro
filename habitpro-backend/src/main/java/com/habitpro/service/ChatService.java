package com.habitpro.service;

import com.habitpro.dto.ChatDTO;
import com.habitpro.entity.ChatMessage;
import com.habitpro.entity.User;
import com.habitpro.repository.ChatMessageRepository;
import com.habitpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ChatMessage sendMessage(ChatDTO dto) {
        User sender = getCurrentUser();
        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        ChatMessage msg = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .message(dto.getMessage())
                .isRead(false)
                .build();
        return chatMessageRepository.save(msg);
    }

    public List<ChatMessage> getConversation(Long friendId) {
        User current = getCurrentUser();
        List<ChatMessage> msgs = chatMessageRepository
                .findConversation(current.getId(), friendId);
        msgs.stream()
                .filter(m -> m.getReceiver().getId().equals(current.getId()) && !m.getIsRead())
                .forEach(m -> {
                    m.setIsRead(true);
                    chatMessageRepository.save(m);
                });
        return msgs;
    }

    public List<ChatMessage> getUnread() {
        return chatMessageRepository.findUnreadMessages(getCurrentUser().getId());
    }
}