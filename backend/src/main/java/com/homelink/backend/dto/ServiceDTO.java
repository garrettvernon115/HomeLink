package com.homelink.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.homelink.backend.model.PriceType;
import com.homelink.backend.model.Service;

/**
 * DTO for returning service information
 * Includes provider and category details
 */
public class ServiceDTO {
    
    private Long id;
    private Long providerId;
    private String providerName;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private BigDecimal basePrice;
    private PriceType priceType;
    private Boolean isActive;
    private LocalDateTime createdAt;

    // Default constructor
    public ServiceDTO() {
    }

    // Constructor from Service entity
    public ServiceDTO(Service service) {
        this.id = service.getId();
        this.providerId = service.getProvider().getId().longValue();
        this.providerName = service.getProvider().getFirstName() + " " + service.getProvider().getLastName();
        this.categoryId = service.getCategory().getId().longValue();
        this.categoryName = service.getCategory().getName();
        this.title = service.getTitle();
        this.description = service.getDescription();
        this.basePrice = service.getBasePrice();
        this.priceType = service.getPriceType();
        this.isActive = service.getIsActive();
        this.createdAt = service.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public PriceType getPriceType() {
        return priceType;
    }

    public void setPriceType(PriceType priceType) {
        this.priceType = priceType;
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
}