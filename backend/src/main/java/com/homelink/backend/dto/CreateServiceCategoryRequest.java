package com.homelink.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class CreateServiceCategoryRequest {
    
    @NotBlank(message = "Category name is required")

    @Size(min = 2, max = 100, message = "Category name must be between 2 and 100 characters")
    private String name;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Size(max = 500, message = "Icon URL cannot exceed 500 characters")
    private String iconUrl;

    private Boolean isActive = true;
    
    private LocalDateTime createdAt;

    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public CreateServiceCategoryRequest() {
    }

    public CreateServiceCategoryRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public CreateServiceCategoryRequest(String name, String description, 
                                       String iconUrl, Boolean isActive) {
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
        this.isActive = isActive != null ? isActive : true;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    @Override
    public String toString() {
        return "CreateServiceCategoryRequest{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", iconUrl='" + iconUrl + '\'' +
                ", isActive=" + isActive + '\''+
                ", iconUrl='" + createdAt +
                '}';
    }
}