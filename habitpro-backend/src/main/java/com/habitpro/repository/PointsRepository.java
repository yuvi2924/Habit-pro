package com.habitpro.repository;

import com.habitpro.entity.Points;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PointsRepository extends JpaRepository<Points, Long> {
    List<Points> findByUserIdOrderByEarnedAtDesc(Long userId);

    @Query("SELECT SUM(p.xpEarned) FROM Points p WHERE p.user.id = :userId")
    Integer getTotalXpByUserId(@Param("userId") Long userId);
}