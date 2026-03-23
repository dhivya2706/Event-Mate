package com.eventmate.dto;

public class ChatEventDTO {

    private String name;
    private String date;
    private String venue;
    private String image;
    private double price;

    public ChatEventDTO(String name, Object date, String venue, String image, double price) {
        this.name = name;
        this.date = String.valueOf(date);
        this.venue = venue;
        this.image = image;
        this.price = price;
    }

    public String getName() { return name; }
    public String getDate() { return date; }
    public String getVenue() { return venue; }
    public String getImage() { return image; }
    public double getPrice() { return price; }
}