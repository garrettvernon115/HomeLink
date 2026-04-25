package com.homelink.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homelink.backend.dto.PaymentRequest;
import com.homelink.backend.dto.PaymentResponse;
import com.homelink.backend.model.Payment;
import com.homelink.backend.model.PaymentStatus;
import com.homelink.backend.model.ServiceRequest;
import com.homelink.backend.model.ServiceRequestStatus;
import com.homelink.backend.repository.PaymentRepository;
import com.homelink.backend.repository.ServiceRequestRepository;

/**
 * Service class for handling payment business logic and operations.
 * Manages payment creation, retrieval, and validation.
 */
@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    /**
     * Create a new payment for a service request.
     * Validates authorization, service request status, and prevents duplicate payments.
     * 
     * @param request Payment request data
     * @param userId ID of the authenticated user (must be homeowner)
     * @return PaymentResponse with created payment details
     * @throws ResponseStatusException 404 if service request not found
     * @throws ResponseStatusException 400 if service request not completed
     * @throws ResponseStatusException 403 if user is not the homeowner
     * @throws ResponseStatusException 409 if payment already exists
     */
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request, Long userId) {
        // 1. Validate service request exists
        ServiceRequest serviceRequest = serviceRequestRepository.findById(request.getServiceRequestId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Service request not found with ID: " + request.getServiceRequestId()
            ));

        // 2. Validate service request is COMPLETED
        if (serviceRequest.getStatus() != ServiceRequestStatus.COMPLETED) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot create payment for service request that is not COMPLETED. Current status: " + serviceRequest.getStatus()
            );
        }

        // 3. Validate user is the homeowner of the service request
        if (!serviceRequest.getHomeowner().getId().equals(userId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You are not authorized to create payment for this service request"
            );
        }

        // 4. Check if payment already exists for this service request
        if (paymentRepository.existsByServiceRequestId(request.getServiceRequestId())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Payment already exists for this service request"
            );
        }

        // 5. Create payment entity
        Payment payment = new Payment();
        payment.setServiceRequest(serviceRequest);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setCardLastFour(request.getCardLastFour());
        
        // 6. Generate transaction ID (UUID)
        payment.setTransactionId(UUID.randomUUID().toString());
        
        // 7. Set status to COMPLETED
        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        
        // 8. Set payment date
        payment.setPaymentDate(LocalDateTime.now());

        // 9. Save payment to database
        Payment savedPayment = paymentRepository.save(payment);

        // 10. Convert to response DTO and return
        return convertToResponse(savedPayment);
    }

    /**
     * Get payment by service request ID.
     * 
     * @param serviceRequestId ID of the service request
     * @return Optional PaymentResponse
     */
    public Optional<PaymentResponse> getPaymentByServiceRequestId(Long serviceRequestId) {
        return paymentRepository.findByServiceRequestId(serviceRequestId)
            .map(this::convertToResponse);
    }

    /**
     * Get all payments for a specific user (homeowner).
     * Returns payments sorted by payment date descending (newest first).
     * 
     * @param userId ID of the user (homeowner)
     * @return List of PaymentResponse objects, empty list if none found
     */
    public List<PaymentResponse> getPaymentsByUserId(Long userId) {
        List<Payment> payments = paymentRepository.findByServiceRequest_Homeowner_Id(userId);
        
        // Sort by payment date descending (newest first)
        payments.sort((p1, p2) -> p2.getPaymentDate().compareTo(p1.getPaymentDate()));
        
        return payments.stream()
            .map(this::convertToResponse)
            .toList();
    }

    /**
     * Convert Payment entity to PaymentResponse DTO.
     * 
     * @param payment Payment entity
     * @return PaymentResponse DTO
     */
    private PaymentResponse convertToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setServiceRequestId(payment.getServiceRequest().getId());
        response.setAmount(payment.getAmount());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setPaymentStatus(payment.getPaymentStatus());
        response.setTransactionId(payment.getTransactionId());
        response.setPaymentDate(payment.getPaymentDate());
        response.setCardLastFour(payment.getCardLastFour());
        return response;
    }
}