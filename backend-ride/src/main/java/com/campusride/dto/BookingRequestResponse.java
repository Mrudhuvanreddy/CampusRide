package com.campusride.dto;

public class BookingRequestResponse {

    private Long id;

    private Long rideId;

    private Long passengerId;

    private String passengerName;

    private String passengerEmail;

    private String status;

    public BookingRequestResponse(
            Long id,
            Long rideId,
            Long passengerId,
            String passengerName,
            String passengerEmail,
            String status) {

        this.id = id;
        this.rideId = rideId;
        this.passengerId = passengerId;
        this.passengerName = passengerName;
        this.passengerEmail = passengerEmail;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getRideId() {
        return rideId;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public String getPassengerEmail() {
        return passengerEmail;
    }

    public String getStatus() {
        return status;
    }
}