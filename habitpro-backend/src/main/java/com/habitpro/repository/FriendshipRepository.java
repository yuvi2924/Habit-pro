package com.habitpro.repository;

import com.habitpro.entity.Friendship;
import com.habitpro.entity.Friendship.Status;
import com.habitpro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    Optional<Friendship> findByRequesterAndReceiver(User requester, User receiver);

    @Query("SELECT f FROM Friendship f WHERE (f.requester = :user OR f.receiver = :user) AND f.status = :status")
    List<Friendship> findAllByUserAndStatus(@Param("user") User user, @Param("status") Status status);

    @Query("SELECT f FROM Friendship f WHERE f.receiver = :user AND f.status = 'pending'")
    List<Friendship> findPendingRequestsForUser(@Param("user") User user);
}