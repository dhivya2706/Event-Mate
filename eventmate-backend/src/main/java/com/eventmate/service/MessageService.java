package com.eventmate.service;

import com.eventmate.entity.Message;
import com.eventmate.repository.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository repo;

    public Message sendMessage(Message message){
        return repo.save(message);
    }

   public List<Message> getChat(Long user1, Long user2){
    return repo.getChat(user1,user2);
}

    public void deleteMessage(Long id){
        repo.deleteById(id);
    }
}