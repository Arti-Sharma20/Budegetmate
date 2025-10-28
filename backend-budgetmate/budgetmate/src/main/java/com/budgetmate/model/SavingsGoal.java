package com.budgetmate.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "savings_goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "target_amount", nullable = false)
    private Double targetAmount;

    // Format: YYYY-MM (e.g. "2025-06")
    @Column(nullable = false, length = 7)
    private String month;
}
