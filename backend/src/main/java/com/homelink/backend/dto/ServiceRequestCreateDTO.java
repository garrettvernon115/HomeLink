package com.homelink.backend.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a service request
 */
public class ServiceRequestCreateDTO {
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    private Long serviceId; // Optional - if homeowner selects specific service
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private LocalDateTime scheduledDate;

    // Default constructor
    public ServiceRequestCreateDTO() {
    }

    // Getters and Setters
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDateTime scheduledDate) {
        this.scheduledDate = scheduledDate;
    }
}