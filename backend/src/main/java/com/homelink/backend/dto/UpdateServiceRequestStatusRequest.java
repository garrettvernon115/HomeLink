package com.homelink.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateServiceRequestStatusRequest {
    
    @NotNull(message = "Provider ID is required")
    private Long providerId;
    
    @NotNull(message = "Status is required")
    private String status;
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
    
    // Constructors
    public UpdateServiceRequestStatusRequest() {
    }

    public UpdateServiceRequestStatusRequest(Long providerId, String status) {
        this.providerId = providerId;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "UpdateServiceRequestStatusRequest{" +
                "providerId=" + providerId +
                ", status='" + status + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }
}