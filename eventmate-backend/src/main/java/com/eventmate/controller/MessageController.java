package com.eventmate.controller;

import com.eventmate.repository.OrganizerRepository;
import com.eventmate.entity.Organizer;
import com.eventmate.entity.Message;
import com.eventmate.service.MessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private OrganizerRepository organizerRepository;

    // SEND MESSAGE
    @PostMapping("/send")
    public Message send(@RequestBody Message message) {

        if (message.getSenderId() == null ||
            message.getReceiverId() == null ||
            message.getMessage() == null ||
            message.getMessage().trim().isEmpty()) {

            throw new RuntimeException("Invalid message");
        }

        return messageService.sendMessage(message);
    }

    // GET CHAT BETWEEN TWO USERS
    @GetMapping("/chat")
    public List<Message> getChat(@RequestParam Long user1,
                                 @RequestParam Long user2) {
        return messageService.getChat(user1, user2);
    }

    // DELETE MESSAGE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        messageService.deleteMessage(id);
    }

    // GET ALL ORGANIZERS
    @GetMapping("/organizers")
    public List<Organizer> getOrganizers() {
        return organizerRepository.findAll();
    }

}