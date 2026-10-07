package com.campusride.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class RideRequest {

    private String source;
    private String destination;
    private LocalDate rideDate;
    private LocalTime rideTime;
    private Integer availableSeats;
    private Double totalExpense;

    public RideRequest() {
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getRideDate() {
        return rideDate;
    }

    public void setRideDate(LocalDate rideDate) {
        this.rideDate = rideDate;
    }

    public LocalTime getRideTime() {
        return rideTime;
    }

    public void setRideTime(LocalTime rideTime) {
        this.rideTime = rideTime;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
    }
}