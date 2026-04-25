package com.homelink.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.homelink.backend.model.ServiceCategory;

/**
 * Response DTO for Service Category
 * Returns category information to frontend
 */
public class ServiceCategoryResponse {
    
    private Integer id;        
    private String name;        
    private String description; 
    private String iconUrl;     
    private Boolean isActive;   
    private BigDecimal estimatedPriceMin;
    private BigDecimal estimatedPriceMax;
    private LocalDateTime createdAt;
    
    // Default Constructor
    public ServiceCategoryResponse() {
    }

    // Constructor from ServiceCategory entity
    public ServiceCategoryResponse(ServiceCategory category) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
        this.iconUrl = category.getIconUrl();
        this.isActive = category.getIsActive();
        this.estimatedPriceMin = category.getEstimatedPriceMin();
        this.estimatedPriceMax = category.getEstimatedPriceMax();
        this.createdAt = category.getCreatedAt();
    }

    // Full Constructor
    public ServiceCategoryResponse(Integer id, String name, 
                                 String description, String iconUrl,
                                 Boolean isActive, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public BigDecimal getEstimatedPriceMin() {
        return estimatedPriceMin;
    }

    public void setEstimatedPriceMin(BigDecimal estimatedPriceMin) {
        this.estimatedPriceMin = estimatedPriceMin;
    }

    public BigDecimal getEstimatedPriceMax() {
        return estimatedPriceMax;
    }

    public void setEstimatedPriceMax(BigDecimal estimatedPriceMax) {
        this.estimatedPriceMax = estimatedPriceMax;
    }

    @Override
    public String toString() {
        return "ServiceCategoryResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", iconUrl='" + iconUrl + '\'' +
                ", isActive=" + isActive +
                ", estimatedPriceMin=" + estimatedPriceMin +
                ", estimatedPriceMax=" + estimatedPriceMax +
                ", createdAt=" + createdAt +
                '}';
    }
}