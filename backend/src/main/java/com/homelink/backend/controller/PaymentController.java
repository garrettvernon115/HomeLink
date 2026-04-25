package com.homelink.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.homelink.backend.dto.PaymentRequest;
import com.homelink.backend.dto.PaymentResponse;
import com.homelink.backend.model.User;
import com.homelink.backend.repository.UserRepository;
import com.homelink.backend.service.PaymentService;

import jakarta.validation.Valid;

/**
 * REST Controller for payment-related endpoints.
 * Handles payment creation and retrieval operations.
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new payment for a service request.
     * Validates that the authenticated user is the homeowner of the service request.
     * 
     * Endpoint: POST /api/payments
     * 
     * @param request Payment request containing service request ID, amount, and payment method
     * @param userDetails Authenticated user details from JWT token
     * @return ResponseEntity with PaymentResponse (201 Created) or error status
     * @throws ResponseStatusException 404 if service request not found
     * @throws ResponseStatusException 400 if service request not COMPLETED
     * @throws ResponseStatusException 403 if user is not the homeowner
     * @throws ResponseStatusException 409 if payment already exists
     */
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Get authenticated user from UserDetails
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "User not found"
            ));

        // Call service to create payment (handles all validation)
        PaymentResponse response = paymentService.createPayment(request, user.getId());

        // Return 201 Created with payment details
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get payment for a specific service request.
     * 
     * Endpoint: GET /api/payments/service-request/{id}
     * 
     * @param id Service request ID
     * @return ResponseEntity with PaymentResponse (200 OK) or 404 if not found
     */
    @GetMapping("/service-request/{id}")
    public ResponseEntity<PaymentResponse> getPaymentByServiceRequest(@PathVariable Long id) {
        return paymentService.getPaymentByServiceRequestId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all payments for the authenticated user.
     * Returns payments sorted by date descending (newest first).
     * 
     * Endpoint: GET /api/payments/user
     * 
     * @param userDetails Authenticated user details from JWT token
     * @return ResponseEntity with List of PaymentResponse (200 OK, empty list if none found)
     */
    @GetMapping("/user")
    public ResponseEntity<List<PaymentResponse>> getUserPayments(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Get authenticated user from UserDetails
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "User not found"
            ));

        // Get all payments for user (sorted by date descending)
        List<PaymentResponse> payments = paymentService.getPaymentsByUserId(user.getId());

        // Return 200 OK with list (empty list if no payments)
        return ResponseEntity.ok(payments);
    }
}