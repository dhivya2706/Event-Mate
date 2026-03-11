package com.eventmate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.eventmate.dto.ChatRequest;
import com.eventmate.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public String chat(@RequestBody ChatRequest request) {

        if(request.getMessage() == null || request.getMessage().trim().isEmpty()){
            return "Message cannot be empty";
        }

        return chatService.getBotResponse(request.getMessage());
    }
}