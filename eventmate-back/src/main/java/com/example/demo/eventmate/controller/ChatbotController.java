package com.example.demo.eventmate.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.eventmate.model.Event;
import com.example.demo.eventmate.repository.EventRepository;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {

    @Autowired
    private EventRepository eventRepository;

    @PostMapping
    public Map<String,String> chat(@RequestBody Map<String,String> body){

        String message = body.getOrDefault("message","").toLowerCase().trim();

        List<Event> events = eventRepository.findAll();

        // ================= GREETING =================
        if(matches(message,"hi","hello","hey","helo","hii","hai")){
            return Map.of("reply",
                    "👋 Hello! Welcome to EventMate AI.\n\n" +
                    "I can help you with:\n" +
                    "• Upcoming events 🎉\n" +
                    "• Ticket prices 💰\n" +
                    "• Event venues 📍\n" +
                    "• Booking guidance 🎫\n\n" +
                    "Try asking:\n" +
                    "👉 upcoming events\n" +
                    "👉 ticket price\n" +
                    "👉 event venue");
        }

        // ================= EVENTS =================
        if(matches(message,"event","events","evnt","evnts","upcoming","show events")){
            if(events.isEmpty()){
                return Map.of("reply","Currently no events are available.");
            }

            String titles = events.stream()
                    .map(Event::getTitle)
                    .collect(Collectors.joining(", "));

            return Map.of("reply",
                    "🎉 Upcoming Events:\n" + titles +
                            "\n\nYou can book them in Browse Events.");
        }

        // ================= PRICE =================
        if(matches(message,"price","cost","ticket","tickets","prce","tiket")){
            if(events.isEmpty()){
                return Map.of("reply","No events available currently.");
            }

            String priceList = events.stream()
                    .map(e -> e.getTitle()+" (₹"+e.getPrice()+")")
                    .collect(Collectors.joining(", "));

            return Map.of("reply","💰 Ticket Prices:\n"+priceList);
        }

        // ================= VENUE =================
        if(matches(message,"venue","location","place","where","locaton")){
            if(events.isEmpty()){
                return Map.of("reply","No events scheduled.");
            }

            String venues = events.stream()
                    .map(e -> e.getTitle()+" → "+e.getVenue())
                    .collect(Collectors.joining("\n"));

            return Map.of("reply","📍 Event Venues:\n"+venues);
        }

        // ================= DATE =================
        if(matches(message,"date","when","day","today")){
            if(events.isEmpty()){
                return Map.of("reply","No events available.");
            }

            String dates = events.stream()
                    .map(e -> e.getTitle()+" → "+e.getEventDate())
                    .collect(Collectors.joining("\n"));

            return Map.of("reply","📅 Event Dates:\n"+dates);
        }

        // ================= FEEDBACK =================
        if(matches(message,"feedback","review","rating","complaint","feedbak")){
            return Map.of("reply",
                    "⭐ To give feedback:\n\n" +
                    "1️⃣ Go to My Bookings\n" +
                    "2️⃣ Select the event\n" +
                    "3️⃣ Submit rating & comment\n\n" +
                    "Your feedback helps improve EventMate.");
        }

        // ================= EVENT SEARCH =================
        for(Event event : events){

            String title = event.getTitle() == null ? "" : event.getTitle().toLowerCase();
            String venue = event.getVenue() == null ? "" : event.getVenue().toLowerCase();

            if(message.length() > 3 && (title.contains(message) || venue.contains(message))){
                return Map.of("reply",
                        "🎉 Found Event:\n\n"+
                                "Event: "+event.getTitle()+
                                "\nVenue: "+event.getVenue()+
                                "\nPrice: ₹"+event.getPrice());
            }
        }

        // ================= DEFAULT =================
        return Map.of("reply",
                "🤖 I didn't understand that.\n\n" +
                "You can ask:\n" +
                "• upcoming events\n" +
                "• ticket price\n" +
                "• event venue\n" +
                "• feedback");
    }

    // ================= SMART MATCH =================
    private boolean matches(String message,String...keywords){
        for(String k:keywords){
            if(message.contains(k)) return true;
        }
        return false;
    }
}