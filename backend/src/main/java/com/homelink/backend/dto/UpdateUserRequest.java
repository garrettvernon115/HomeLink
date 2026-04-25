package com.homelink.backend.dto;

import jakarta.validation.constraints.Size;

public class UpdateUserRequest {

    @Size(max = 100)
    String firstName;

    @Size(max = 100)
    String lastName;

    @Size(max = 15)
    String phone;

    public UpdateUserRequest() {
    }

    public UpdateUserRequest(String firstName, String lastName, String phone) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
