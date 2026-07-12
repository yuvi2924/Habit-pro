package com.habitpro.service;

import com.habitpro.dto.FriendDTO;
import com.habitpro.entity.Friendship;
import com.habitpro.entity.Friendship.Status;
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
public class FriendService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String sendRequest(String username) {
        User current = getCurrentUser();
        User receiver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (current.getId().equals(receiver.getId()))
            throw new RuntimeException("Cannot add yourself");
        friendshipRepository.findByRequesterAndReceiver(current, receiver)
                .ifPresent(f -> { throw new RuntimeException("Request already sent"); });
        Friendship friendship = Friendship.builder()
                .requester(current)
                .receiver(receiver)
                .status(Status.pending)
                .build();
        friendshipRepository.save(friendship);
        return "Friend request sent to " + username;
    }

    public String respondToRequest(Long friendshipId, boolean accept) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        friendship.setStatus(accept ? Status.accepted : Status.rejected);
        friendshipRepository.save(friendship);
        return accept ? "Friend request accepted" : "Friend request rejected";
    }

    public List<FriendDTO> getMyFriends() {
        User current = getCurrentUser();
        return friendshipRepository.findAllByUserAndStatus(current, Status.accepted)
                .stream()
                .map(f -> {
                    User friend = f.getRequester().getId().equals(current.getId())
                            ? f.getReceiver() : f.getRequester();
                    return new FriendDTO(friend.getId(), friend.getUsername(),
                            friend.getEmail(), friend.getLevel(),
                            friend.getTotalXp(), "accepted");
                })
                .collect(Collectors.toList());
    }

    public List<FriendDTO> getPendingRequests() {
        User current = getCurrentUser();
        return friendshipRepository.findPendingRequestsForUser(current)
                .stream()
                .map(f -> new FriendDTO(f.getId(), f.getRequester().getUsername(),
                        f.getRequester().getEmail(), f.getRequester().getLevel(),
                        f.getRequester().getTotalXp(), "pending"))
                .collect(Collectors.toList());
    }

    public FriendDTO getFriendProgress(Long friendId) {
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new FriendDTO(friend.getId(), friend.getUsername(),
                friend.getEmail(), friend.getLevel(), friend.getTotalXp(), "accepted");
    }
}