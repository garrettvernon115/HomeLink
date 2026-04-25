package com.homelink.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "service_categories")
public class ServiceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "estimated_price_min", precision = 10, scale = 2)
    private BigDecimal estimatedPriceMin;

    @Column(name = "estimated_price_max", precision = 10, scale = 2)
    private BigDecimal estimatedPriceMax;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Default constructor
    public ServiceCategory() {
    }

    // Constructor with fields
    public ServiceCategory(String name, String description) {
        this.name = name;
        this.description = description;
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
        return "ServiceCategory{" +
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