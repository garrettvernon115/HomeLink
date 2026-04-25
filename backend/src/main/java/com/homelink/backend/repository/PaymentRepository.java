package com.homelink.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homelink.backend.model.Payment;
import com.homelink.backend.model.PaymentMethod;
import com.homelink.backend.model.PaymentStatus;

/**
 * Repository interface for Payment database operations.
 * Extends JpaRepository to provide CRUD operations and custom queries.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    /**
     * Find payment by service request ID.
     * Each service request should have at most one payment.
     * 
     * @param id Service request ID
     * @return Optional payment for the service request
     */
    Optional<Payment> findByServiceRequestId(Long id);
    
    /**
     * Find all payments for a specific homeowner.
     * Uses Spring Data JPA nested property navigation to traverse:
     * Payment -> ServiceRequest -> Homeowner (User)
     * 
     * @param userId Homeowner user ID
     * @return List of all payments for the homeowner's service requests
     */
    List<Payment> findByServiceRequest_Homeowner_Id(Long userId);
    
    // Additional useful queries
    
    /**
     * Find all payments for a specific provider.
     * Useful for providers to see their earnings.
     * 
     * @param providerId Provider user ID
     * @return List of all payments for the provider's completed services
     */
    List<Payment> findByServiceRequest_Provider_Id(Long providerId);
    
    /**
     * Find all payments with a specific status.
     * 
     * @param status Payment status (PENDING, COMPLETED, FAILED, REFUNDED)
     * @return List of payments with the given status
     */
    List<Payment> findByPaymentStatus(PaymentStatus status);
    
    /**
     * Find all payments with a specific status, ordered by payment date descending.
     * Useful for displaying recent payments first.
     * 
     * @param status Payment status
     * @return List of payments ordered by date (newest first)
     */
    List<Payment> findByPaymentStatusOrderByPaymentDateDesc(PaymentStatus status);
    
    /**
     * Find all payments made with a specific payment method.
     * 
     * @param method Payment method (CREDIT_CARD, DEBIT_CARD, PAYPAL, etc.)
     * @return List of payments using the specified method
     */
    List<Payment> findByPaymentMethod(PaymentMethod method);
    
    /**
     * Find all payments within a date range.
     * Useful for generating reports and analytics.
     * 
     * @param start Start date/time
     * @param end End date/time
     * @return List of payments within the date range
     */
    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Count the number of payments with a specific status.
     * Useful for dashboard statistics.
     * 
     * @param status Payment status
     * @return Count of payments with the given status
     */
    Long countByPaymentStatus(PaymentStatus status);
    
    /**
     * Check if a payment exists for a specific service request.
     * Useful for validation before creating a payment.
     * 
     * @param serviceRequestId Service request ID
     * @return true if payment exists, false otherwise
     */
    boolean existsByServiceRequestId(Long serviceRequestId);
    
    /**
     * Find all payments for a homeowner with a specific status.
     * Combines user filtering with status filtering.
     * 
     * @param userId Homeowner user ID
     * @param status Payment status
     * @return List of payments matching both criteria
     */
    List<Payment> findByServiceRequest_Homeowner_IdAndPaymentStatus(Long userId, PaymentStatus status);
    
    /**
     * Find all payments for a provider with a specific status.
     * 
     * @param providerId Provider user ID
     * @param status Payment status
     * @return List of payments matching both criteria
     */
    List<Payment> findByServiceRequest_Provider_IdAndPaymentStatus(Long providerId, PaymentStatus status);
}