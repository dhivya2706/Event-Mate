package com.eventmate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.eventmate.repository.EventRepository;
import com.eventmate.entity.Event;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private EventRepository eventRepository;

    public String getBotResponse(String message) {

        message = message.toLowerCase();

        if(message.contains("event") || message.contains("show events") || message.contains("upcoming")) {

            List<Event> events = eventRepository.findTop5ByOrderByEventDateAsc();

            if(events.isEmpty()) {
                return "No upcoming events available right now.";
            }

            String response = "Here are some upcoming events:\n\n";

            for(Event e : events) {
                response +=
                        "🎉 " + e.getEventName() + "\n" +
                        "📅 Date: " + e.getEventDate() + "\n" +
                        "📍 Venue: " + e.getVenue() + "\n" +
                        "💺 VIP Price: ₹" + e.getVipPrice() + "\n" +
                        "⭐ Premium Price: ₹" + e.getPremiumPrice() + "\n" +
                        "🎟 Regular Price: ₹" + e.getRegularPrice() + "\n\n";
            }

            return response;
        }

        if(message.contains("book")) {
            return "To book tickets:\n1️⃣ Open Browse Events page\n2️⃣ Search and Select event\n3️⃣ Choose seat type\n4️⃣ Complete payment.";
        }

        if(message.contains("payment") || message.contains("pay")) {
            return "EventMate supports:\n💳 UPI\n💳 Debit/Credit Card\n💳 Net Banking.";
        }

        return "I can help you with:\n• Event suggestions\n• Booking help\n• Payment help\nTry asking: 'Show upcoming events'";
    }

    
}