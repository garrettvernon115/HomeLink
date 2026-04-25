package com.homelink.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homelink.backend.dto.ServiceRequestCreateDTO;
import com.homelink.backend.dto.ServiceRequestResponseDTO;
import com.homelink.backend.dto.UpdateServiceRequestStatusRequest;
import com.homelink.backend.model.Service;
import com.homelink.backend.model.ServiceCategory;
import com.homelink.backend.model.ServiceRequest;
import com.homelink.backend.model.ServiceRequestStatus;
import com.homelink.backend.model.User;
import com.homelink.backend.repository.ServiceCategoryRepository;
import com.homelink.backend.repository.ServiceRepository;
import com.homelink.backend.repository.ServiceRequestRepository;
import com.homelink.backend.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/service-requests")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    /**
     * POST /api/service-requests
     * Create a new service request
     */
    @PostMapping
    public ResponseEntity<?> createServiceRequest(
            @Valid @RequestBody ServiceRequestCreateDTO requestDTO,
            @RequestParam Long homeownerId) {
        try {
            // Find homeowner
            User homeowner = userRepository.findById(homeownerId).orElse(null);
            if (homeowner == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Homeowner not found");
            }

            // Find category
            ServiceCategory category = categoryRepository.findById(requestDTO.getCategoryId().intValue()).orElse(null);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Category not found");
            }

            // Find service if specified
            Service service = null;
            if (requestDTO.getServiceId() != null) {
                service = serviceRepository.findById(requestDTO.getServiceId()).orElse(null);
                if (service == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Service not found");
                }
            }

            // Create service request
            ServiceRequest serviceRequest = new ServiceRequest();
            serviceRequest.setHomeowner(homeowner);
            serviceRequest.setCategory(category);
            serviceRequest.setService(service);
            serviceRequest.setDescription(requestDTO.getDescription());
            serviceRequest.setScheduledDate(requestDTO.getScheduledDate());
            serviceRequest.setStatus(ServiceRequestStatus.PENDING);
            

            ServiceRequest savedRequest = serviceRequestRepository.save(serviceRequest);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ServiceRequestResponseDTO(savedRequest));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating service request: " + e.getMessage());
        }
    }

    /**
     * GET /api/service-requests/homeowner/{homeownerId}
     * Get all service requests for a homeowner
     */
    @GetMapping("/homeowner/{homeownerId}")
    public ResponseEntity<List<ServiceRequestResponseDTO>> getHomeownerRequests(
            @PathVariable Long homeownerId) {
        try {
            List<ServiceRequest> requests = serviceRequestRepository.findByHomeownerId(homeownerId);

            List<ServiceRequestResponseDTO> responseDTOs = requests.stream()
                    .map(ServiceRequestResponseDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responseDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/service-requests/provider/{providerId}
     * Get all service requests assigned to a provider
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ServiceRequestResponseDTO>> getProviderRequests(
            @PathVariable Long providerId) {
        try {
            List<ServiceRequest> requests = serviceRequestRepository.findByProviderId(providerId);

            List<ServiceRequestResponseDTO> responseDTOs = requests.stream()
                    .map(ServiceRequestResponseDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responseDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/service-requests/available
     * Get all pending service requests (for providers to view)
     */
    @GetMapping("/available")
    public ResponseEntity<List<ServiceRequestResponseDTO>> getAvailableRequests() {
        try {
            List<ServiceRequest> requests = serviceRequestRepository.findByStatus(ServiceRequestStatus.PENDING);

            List<ServiceRequestResponseDTO> responseDTOs = requests.stream()
                    .map(ServiceRequestResponseDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responseDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PATCH /api/service-requests/{requestId}/accept
     * Provider accepts a service request
     */
    @PatchMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptServiceRequest(
            @PathVariable Long requestId,
            @RequestParam Long providerId,
            @RequestParam(required = false) Long serviceId,
            @RequestBody(required = false) java.util.Map<String, Object> requestBody) {
        try {
            // Find service request
            ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId).orElse(null);
            if (serviceRequest == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service request not found");
            }

            // Check if already assigned
            if (serviceRequest.getProvider() != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Service request already assigned to a provider");
            }

            // Find provider
            User provider = userRepository.findById(providerId).orElse(null);
            if (provider == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Provider not found");
            }

            // Find service if specified
            Service service = null;
            if (serviceId != null) {
                service = serviceRepository.findById(serviceId).orElse(null);
                if (service == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Service not found");
                }
                // Set agreed price from service
                serviceRequest.setAgreedPrice(service.getBasePrice());
                serviceRequest.setService(service);
            } else if (requestBody != null && requestBody.containsKey("agreedPrice")) {
                // Set agreed price from request body
                Object priceObj = requestBody.get("agreedPrice");
                if (priceObj != null) {
                    java.math.BigDecimal agreedPrice = new java.math.BigDecimal(priceObj.toString());
                    serviceRequest.setAgreedPrice(agreedPrice);
                }
            }

            serviceRequest.setProvider(provider);
            // Service request is accepted but homeowner still needs to confirm or decline quote
            serviceRequest.setStatus(ServiceRequestStatus.PENDING_QUOTE);

            ServiceRequest updatedRequest = serviceRequestRepository.save(serviceRequest);

            return ResponseEntity.ok(new ServiceRequestResponseDTO(updatedRequest));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error accepting service request: " + e.getMessage());
        }
    }

    /**
     * GET /api/service-requests/{id}
     * Get a specific service request by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceRequestById(@PathVariable Long id) {
        try {
            ServiceRequest serviceRequest = serviceRequestRepository.findById(id).orElse(null);

            if (serviceRequest == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service request not found");
            }

            return ResponseEntity.ok(new ServiceRequestResponseDTO(serviceRequest));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * PATCH /api/service-requests/{id}/status
     * Update service request status (for marking as completed, cancelled, etc.)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateServiceRequestStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateServiceRequestStatusRequest request) {
        try {
            // Find service request
            ServiceRequest serviceRequest = serviceRequestRepository.findById(id).orElse(null);
            if (serviceRequest == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service request not found");
            }

            // Parse and validate status
            ServiceRequestStatus newStatus;
            try {
                newStatus = ServiceRequestStatus.valueOf(request.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid status. Valid values: PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED");
            }

            // Verify provider if status is being changed to IN_PROGRESS or COMPLETED
            if ((newStatus == ServiceRequestStatus.IN_PROGRESS || newStatus == ServiceRequestStatus.COMPLETED)
                    && request.getProviderId() != null) {
                if (serviceRequest.getProvider() == null ||
                        !serviceRequest.getProvider().getId().equals(request.getProviderId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Only the assigned provider can update status to IN_PROGRESS or COMPLETED");
                }
            }
            
        if (newStatus == ServiceRequestStatus.DECLINED) {
            serviceRequest.setCancellationReason(request.getNotes());
            serviceRequest.setAgreedPrice(null); 
        }
            // Update status
            serviceRequest.setStatus(newStatus);

            // Set completion date if marking as completed
            if (newStatus == ServiceRequestStatus.COMPLETED) {
                serviceRequest.setCompletionDate(java.time.LocalDateTime.now());
            }

            ServiceRequest updatedRequest = serviceRequestRepository.save(serviceRequest);

            return ResponseEntity.ok(new ServiceRequestResponseDTO(updatedRequest));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating service request status: " + e.getMessage());
        }
    }

    /**
     * GET /api/service-requests/all
     * Get all service requests across the platform (Admin only)
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ServiceRequestResponseDTO>> getAllServiceRequests() {
        try {
            List<ServiceRequest> requests = serviceRequestRepository.findAll();

            List<ServiceRequestResponseDTO> responseDTOs = requests.stream()
                    .map(ServiceRequestResponseDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responseDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PATCH /api/service-requests/{id}/admin-cancel
     * Admin cancels a service request with a reason
     */
    @PatchMapping("/{id}/admin-cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminCancelRequest(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> requestBody) {
        try {
            // Find service request
            ServiceRequest serviceRequest = serviceRequestRepository.findById(id).orElse(null);
            if (serviceRequest == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service request not found");
            }

            // Validate reason is provided
            String reason = requestBody.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Cancellation reason is required");
            }

            // Update status and set cancellation reason
            serviceRequest.setStatus(ServiceRequestStatus.CANCELLED);
            serviceRequest.setCancellationReason(reason);

            ServiceRequest updatedRequest = serviceRequestRepository.save(serviceRequest);

            return ResponseEntity.ok("Service request cancelled successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error cancelling service request: " + e.getMessage());
        }
    }
}
