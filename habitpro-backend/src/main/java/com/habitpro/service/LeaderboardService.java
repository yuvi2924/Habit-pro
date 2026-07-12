package com.habitpro.service;

import com.habitpro.dto.LeaderboardDTO;
import com.habitpro.entity.Friendship;
import com.habitpro.entity.User;
import com.habitpro.repository.FriendshipRepository;
import com.habitpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<LeaderboardDTO> getGlobalLeaderboard() {
        return userRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getTotalXp() - a.getTotalXp())
                .limit(20)
                .map(u -> new LeaderboardDTO(u.getId(), u.getUsername(),
                        u.getTotalXp(), u.getLevel(), "global"))
                .collect(Collectors.toList());
    }

    public List<LeaderboardDTO> getFriendsLeaderboard() {
        User current = getCurrentUser();
        List<Friendship> friendships = friendshipRepository
                .findAllByUserAndStatus(current, Friendship.Status.accepted);

        List<User> friends = friendships.stream()
                .map(f -> f.getRequester().getId().equals(current.getId())
                        ? f.getReceiver() : f.getRequester())
                .collect(Collectors.toList());
        friends.add(current);

        return friends.stream()
                .sorted((a, b) -> b.getTotalXp() - a.getTotalXp())
                .map(u -> new LeaderboardDTO(u.getId(), u.getUsername(),
                        u.getTotalXp(), u.getLevel(),
                        u.getId().equals(current.getId()) ? "me" : "friend"))
                .collect(Collectors.toList());
    }
}