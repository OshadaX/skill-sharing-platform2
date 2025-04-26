package com.oshada.learningplan.controller;

import com.oshada.learningplan.model.LearningPlan;
import com.oshada.learningplan.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    // Create new Learning Plan
    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan) {
        return learningPlanRepository.save(plan);
    }

    // Get all Learning Plans
    @GetMapping
    public List<LearningPlan> getAllPlans() {
        return learningPlanRepository.findAll();
    }

    // Get Learning Plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable Long id) {
        Optional<LearningPlan> plan = learningPlanRepository.findById(id);
        if (plan.isPresent()) {
            return ResponseEntity.ok(plan.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update an existing Learning Plan
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updatePlan(@PathVariable Long id, @RequestBody LearningPlan updatedPlan) {
        if (!learningPlanRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        updatedPlan.setId(id);  // Set the ID for the entity to update
        LearningPlan savedPlan = learningPlanRepository.save(updatedPlan);
        return ResponseEntity.ok(savedPlan);
    }

    // Delete a Learning Plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        if (!learningPlanRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        learningPlanRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
