package com.campusride.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class RideResponse {

    private Long id;
    private Long driverId;
    private String driverName;
    private String driverEmail;

    private String source;
    private String destination;
    private LocalDate rideDate;
    private LocalTime rideTime;
    private Integer availableSeats;
    private Double totalExpense;
    private String status;

    public RideResponse(
            Long id,
            Long driverId,
            String driverName,
            String driverEmail,
            String source,
            String destination,
            LocalDate rideDate,
            LocalTime rideTime,
            Integer availableSeats,
            Double totalExpense,
            String status) {

        this.id = id;
        this.driverId = driverId;
        this.driverName = driverName;
        this.driverEmail = driverEmail;
        this.source = source;
        this.destination = destination;
        this.rideDate = rideDate;
        this.rideTime = rideTime;
        this.availableSeats = availableSeats;
        this.totalExpense = totalExpense;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getDriverId() {
        return driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getDriverEmail() {
        return driverEmail;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public LocalDate getRideDate() {
        return rideDate;
    }

    public LocalTime getRideTime() {
        return rideTime;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public String getStatus() {
        return status;
    }
}