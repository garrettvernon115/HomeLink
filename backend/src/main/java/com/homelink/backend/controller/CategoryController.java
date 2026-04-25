package com.homelink.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homelink.backend.dto.CreateServiceCategoryRequest;
import com.homelink.backend.dto.ServiceCategoryResponse;
import com.homelink.backend.model.ServiceCategory;
import com.homelink.backend.repository.ServiceCategoryRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    /**
     * GET /api/categories
     * Get all service categories
     */
    @GetMapping
    public ResponseEntity<List<ServiceCategoryResponse>> getAllCategories() {
        try {
            List<ServiceCategoryResponse> categories = categoryRepository.findAll().stream()
                    .map(ServiceCategoryResponse::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/categories
     * Create a new service category
     */
    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CreateServiceCategoryRequest request) {
        try {
            // Convert DTO to entity
            ServiceCategory category = new ServiceCategory();
            category.setName(request.getName());
            category.setDescription(request.getDescription());
            category.setIconUrl(request.getIconUrl());
            category.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
            
            ServiceCategory savedCategory = categoryRepository.save(category);
            
            // Return DTO response
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ServiceCategoryResponse(savedCategory));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating category: " + e.getMessage());
        }
    }

    /**
     * GET /api/categories/{id}
     * Get category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Integer id) {
        try {
            ServiceCategory category = categoryRepository.findById(id).orElse(null);
            
            if (category == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Category not found");
            }
            
            return ResponseEntity.ok(new ServiceCategoryResponse(category));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}