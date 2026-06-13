package com.truckmitra.controller;

import com.truckmitra.exception.AppExceptions;
import com.truckmitra.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    @GetMapping("/history/{userA}/{userB}")
    public ResponseEntity<?> getChatHistory(@PathVariable Long userA, @PathVariable Long userB) {
        // Chat service not present in project; return not implemented
        throw new AppExceptions.ValidationException("Chat service not available in this build");
    }

    @PostMapping
    public ResponseEntity<?> postChat(@RequestBody Object payload) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new AppExceptions.UnauthorizedActionException("Unauthorized");
        throw new AppExceptions.ValidationException("Chat posting not implemented");
    }
}