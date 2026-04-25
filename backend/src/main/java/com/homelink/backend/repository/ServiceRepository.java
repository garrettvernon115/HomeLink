package com.homelink.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homelink.backend.model.Service;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    /**
     * Find all services by category ID
     */
    List<Service> findByCategoryId(Long categoryId);
    
    /**
     * Find all services by provider ID
     */
    List<Service> findByProviderId(Long providerId);
    
    /**
     * Find all active services
     */
    List<Service> findByIsActiveTrue();
    
    /**
     * Find active services by category
     */
    @Query("SELECT s FROM Service s WHERE s.category.id = :categoryId AND s.isActive = true")
    List<Service> findActiveByCategoryId(@Param("categoryId") Long categoryId);
    
    /**
     * Find active services by provider
     */
    @Query("SELECT s FROM Service s WHERE s.provider.id = :providerId AND s.isActive = true")
    List<Service> findActiveByProviderId(@Param("providerId") Long providerId);
}