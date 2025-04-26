package com.oshada.learningplan.repository;

import com.oshada.learningplan.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
}