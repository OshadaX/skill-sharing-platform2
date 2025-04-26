package com.oshada.learningplan.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class LearningPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String deadline; // Format: "YYYY-MM-DD"
    private boolean isCompleted;
}