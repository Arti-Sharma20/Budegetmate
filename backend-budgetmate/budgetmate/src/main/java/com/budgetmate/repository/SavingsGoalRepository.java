package com.budgetmate.repository;

import com.budgetmate.model.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {
    Optional<SavingsGoal> findByUserIdAndMonth(Long userId, String month);
}
