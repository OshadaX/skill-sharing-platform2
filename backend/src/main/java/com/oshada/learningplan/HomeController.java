package com.oshada.learningplan;  // Same package as LearningplanApplication

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    
    @GetMapping("/welcome")
    public String home() {
        return "Welcome to HomeStock!";
    }
}
