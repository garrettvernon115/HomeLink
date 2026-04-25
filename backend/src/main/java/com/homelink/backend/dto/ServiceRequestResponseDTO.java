package com.homelink.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.homelink.backend.model.ServiceRequest;
import com.homelink.backend.model.ServiceRequestStatus;

/**
 * DTO for returning service request information
 * Includes homeowner, provider, category, and service details
 */
public class ServiceRequestResponseDTO {
    
    private Long id;
    private Long homeownerId;
    private String homeownerName;
    private Long providerId;
    private String providerName;
    private Long categoryId;
    private String categoryName;
    private Long serviceId;
    private String serviceTitle;
    private String description;
    private ServiceRequestStatus status;
    private BigDecimal agreedPrice;
    private LocalDateTime scheduledDate;
    private LocalDateTime completionDate;
    private LocalDateTime createdAt;

    // Default constructor
    public ServiceRequestResponseDTO() {
    }

    // Constructor from ServiceRequest entity
    public ServiceRequestResponseDTO(ServiceRequest request) {
        this.id = request.getId();
        this.homeownerId = request.getHomeowner().getId();
        this.homeownerName = request.getHomeowner().getFirstName() + " " + request.getHomeowner().getLastName();
        
        if (request.getProvider() != null) {
            this.providerId = request.getProvider().getId();
            this.providerName = request.getProvider().getFirstName() + " " + request.getProvider().getLastName();
        }
        
        this.categoryId = request.getCategory().getId().longValue();
        this.categoryName = request.getCategory().getName();
        
        if (request.getService() != null) {
            this.serviceId = request.getService().getId();
            this.serviceTitle = request.getService().getTitle();
        }
        
        this.description = request.getDescription();
        this.status = request.getStatus();
        this.agreedPrice = request.getAgreedPrice();
        this.scheduledDate = request.getScheduledDate();
        this.completionDate = request.getCompletionDate();
        this.createdAt = request.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHomeownerId() {
        return homeownerId;
    }

    public void setHomeownerId(Long homeownerId) {
        this.homeownerId = homeownerId;
    }

    public String getHomeownerName() {
        return homeownerName;
    }

    public void setHomeownerName(String homeownerName) {
        this.homeownerName = homeownerName;
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

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceTitle() {
        return serviceTitle;
    }

    public void setServiceTitle(String serviceTitle) {
        this.serviceTitle = serviceTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ServiceRequestStatus getStatus() {
        return status;
    }

    public void setStatus(ServiceRequestStatus status) {
        this.status = status;
    }

    public BigDecimal getAgreedPrice() {
        return agreedPrice;
    }

    public void setAgreedPrice(BigDecimal agreedPrice) {
        this.agreedPrice = agreedPrice;
    }

    public LocalDateTime getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDateTime scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalDateTime getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDateTime completionDate) {
        this.completionDate = completionDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}