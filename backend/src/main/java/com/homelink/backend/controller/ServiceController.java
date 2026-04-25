package com.homelink.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homelink.backend.dto.ServiceDTO;
import com.homelink.backend.model.Service;
import com.homelink.backend.repository.ServiceRepository;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    /**
     * GET /api/services
     * Get all active services (optionally filter by category)
     */
    @GetMapping
    public ResponseEntity<List<ServiceDTO>> getAllServices(
            @RequestParam(required = false) Long categoryId) {
        try {
            List<Service> services;
            
            if (categoryId != null) {
                // Get services by category
                services = serviceRepository.findActiveByCategoryId(categoryId);
            } else {
                // Get all active services
                services = serviceRepository.findByIsActiveTrue();
            }

            List<ServiceDTO> serviceDTOs = services.stream()
                    .map(ServiceDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(serviceDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/services/{id}
     * Get service by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id) {
        try {
            Service service = serviceRepository.findById(id).orElse(null);
            
            if (service == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service not found");
            }
            
            return ResponseEntity.ok(new ServiceDTO(service));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * GET /api/services/provider/{providerId}
     * Get all services offered by a specific provider
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ServiceDTO>> getServicesByProvider(@PathVariable Long providerId) {
        try {
            List<Service> services = serviceRepository.findActiveByProviderId(providerId);
            
            List<ServiceDTO> serviceDTOs = services.stream()
                    .map(ServiceDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(serviceDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/services/count
     * Get total number of active services
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getServiceCount() {
        try {
            long count = serviceRepository.findByIsActiveTrue().size();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}