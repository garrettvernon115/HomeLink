package com.homelink.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "homeowner_id", nullable = false)
    private User homeowner;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private User provider;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "agreed_price", precision = 10, scale = 2)
    private java.math.BigDecimal agreedPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private ServiceRequestStatus status = ServiceRequestStatus.PENDING;

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;

    // Default constructor
    public ServiceRequest() {
    }

    // Constructor with required fields
    public ServiceRequest(User homeowner, ServiceCategory category, String description) {
        this.homeowner = homeowner;
        this.category = category;
        this.description = description;
        this.status = ServiceRequestStatus.PENDING;
    }

    // Constructor with service
    public ServiceRequest(User homeowner, ServiceCategory category, Service service, String description) {
        this.homeowner = homeowner;
        this.category = category;
        this.service = service;
        this.description = description;
        this.status = ServiceRequestStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getHomeowner() {
        return homeowner;
    }

    public void setHomeowner(User homeowner) {
        this.homeowner = homeowner;
    }

    public User getProvider() {
        return provider;
    }

    public void setProvider(User provider) {
        this.provider = provider;
    }

    public ServiceCategory getCategory() {
        return category;
    }

    public void setCategory(ServiceCategory category) {
        this.category = category;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public java.math.BigDecimal getAgreedPrice() {
        return agreedPrice;
    }

    public void setAgreedPrice(java.math.BigDecimal agreedPrice) {
        this.agreedPrice = agreedPrice;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    @Override
    public String toString() {
        return "ServiceRequest{" +
                "id=" + id +
                ", homeownerId=" + (homeowner != null ? homeowner.getId() : null) +
                ", providerId=" + (provider != null ? provider.getId() : null) +
                ", categoryId=" + (category != null ? category.getId() : null) +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", scheduledDate=" + scheduledDate +
                ", completionDate=" + completionDate +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}