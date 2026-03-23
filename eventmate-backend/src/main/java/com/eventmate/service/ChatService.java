package com.eventmate.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventmate.dto.ChatEventDTO;
import com.eventmate.entity.Event;
import com.eventmate.repository.EventRepository;

@Service
public class ChatService {

    @Autowired
    private EventRepository eventRepository;

    public Object getBotResponse(String message) {

        message = message.toLowerCase().trim();

        if (message.contains("hello") || message.contains("hi")) {
            return "Hello 👋 I am EventMate AI Assistant. How can I help you today?";
        }

        if (message.contains("help") || message.contains("what can you do")) {
            return "I can help you with:\n\n"
                    + "🎉 Show upcoming events\n"
                    + "💰 Cheap events\n"
                    + "📍 Events in a city\n"
                    + "🎟 Booking help\n"
                    + "💳 Payment help";
        }

        if (message.contains("what events") || message.contains("show me events")
                || message.contains("upcoming events")) {

            List<Event> events = eventRepository.findTop5ByOrderByEventDateAsc();

            if (events.isEmpty()) {
                return "No upcoming events available.";
            }

            return mapEvents(events);
        }

        if (message.contains("cheap events") || message.contains("budget events")) {

            List<Event> events = eventRepository.findTop5ByOrderByRegularPriceAsc();

            if (events.isEmpty()) {
                return "No budget events available.";
            }

            return mapEvents(events);
        }

        if (message.contains("events in")) {

            String venue = message.substring(message.indexOf("in") + 2).trim();

            List<Event> events = eventRepository.findByVenueContainingIgnoreCase(venue);

            if (events.isEmpty()) {
                return "No events found in " + venue;
            }

            return mapEvents(events);
        }
        if (message.contains("how can i book") || message.contains("how to book")) {
            return "To book tickets:\n\n"
                    + "1️⃣ Browse Events\n"
                    + "2️⃣ Select your event\n"
                    + "3️⃣ Choose seat category\n"
                    + "4️⃣ Complete payment.";
        }

        if (message.contains("price") || message.contains("ticket")) {
            return "Ticket prices depend on seat category like VIP, Premium, and Regular.";
        }
        if (message.contains("where is the event") || message.contains("venue")) {
            return "Event venue details are shown in each event card.";
        }

        if (message.contains("event date") || message.contains("when is the event")) {
            return "Event date is displayed in the event details.";
        }
        if (message.contains("vip")) {
            return "VIP seats provide the best experience with premium view.";
        }

        if (message.contains("premium")) {
            return "Premium seats provide great value and comfort.";
        }

        if (message.contains("regular")) {
            return "Regular seats are budget-friendly.";
        }

        if (message.contains("payment") || message.contains("how to pay")) {
            return "EventMate supports UPI, Debit/Credit Card, and Net Banking.";
        }
        if (message.contains("refund")) {
            return "Refunds are available only if the event is cancelled.";
        }

        if (message.contains("contact")) {
            return "Contact us at support@eventmate.com";
        }

        return "Try asking:\n"
                + "• What events are available?\n"
                + "• Show me upcoming events\n"
                + "• Events in Chennai\n"
                + "• How can I book tickets?";
    }

    private List<ChatEventDTO> mapEvents(List<Event> events) {

        List<ChatEventDTO> result = new ArrayList<>();

        for (Event e : events) {
            result.add(new ChatEventDTO(
                    e.getEventName(),
                    e.getEventDate(),
                    e.getVenue(),
                    e.getImageName(),
                    e.getRegularPrice()
            ));
        }

        return result;
    }
}
