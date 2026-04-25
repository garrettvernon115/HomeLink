package com.homelink.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homelink.backend.model.ServiceRequest;
import com.homelink.backend.model.ServiceRequestStatus;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    /**
     * Find all service requests by homeowner user ID
     * @param homeownerId The ID of the homeowner
     * @return List of service requests for the homeowner
     */
    List<ServiceRequest> findByHomeownerId(Long homeownerId);

    /**
     * Find all service requests by provider user ID
     * @param providerId The ID of the provider
     * @return List of service requests assigned to the provider
     */
    List<ServiceRequest> findByProviderId(Long providerId);

    /**
     * Find all service requests by service category ID
     * @param categoryId The ID of the service category
     * @return List of service requests in that category
     */
    List<ServiceRequest> findByCategoryId(Integer categoryId);

    /**
     * Find all service requests by status
     * @param status The status of the service request
     * @return List of service requests with that status
     */
    List<ServiceRequest> findByStatus(ServiceRequestStatus status);

    /**
     * Find all service requests by homeowner ID and status
     * @param homeownerId The ID of the homeowner
     * @param status The status of the service request
     * @return List of service requests matching both criteria
     */
    List<ServiceRequest> findByHomeownerIdAndStatus(Long homeownerId, ServiceRequestStatus status);

    /**
     * Find all service requests by provider ID and status
     * @param providerId The ID of the provider
     * @param status The status of the service request
     * @return List of service requests matching both criteria
     */
    List<ServiceRequest> findByProviderIdAndStatus(Long providerId, ServiceRequestStatus status);
}