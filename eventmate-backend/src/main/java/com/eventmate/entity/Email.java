package com.eventmate.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class Email {

    @Autowired
    JavaMailSender mailSender;

    public void sendReminder(String email, String event, String date) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Event Reminder");

        message.setText(
                "Reminder!\n\nYour event " + event
                + " is scheduled on " + date
                + ".\n\nSee you there!"
        );

        mailSender.send(message);

    }

}
