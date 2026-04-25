package com.homelink.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homelink.backend.dto.ChangePasswordRequest;
import com.homelink.backend.dto.UpdateUserRequest;
import com.homelink.backend.dto.UpdateUserStatusRequest;
import com.homelink.backend.dto.UserDTO;
import com.homelink.backend.dto.UserProfileResponse;
import com.homelink.backend.model.User;
import com.homelink.backend.model.UserRole;
import com.homelink.backend.repository.UserRepository;
import com.homelink.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private UserService userService;

    /**
     * GET /api/users
     * Get all users (with optional role filter)
     * @param role Optional role filter (HOMEOWNER, PROVIDER, ADMIN)
     * @return List of users (without passwords)
     */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestParam(required = false) UserRole role) {
        try {
            List<User> users;
            
            if (role != null) {
                // Filter by role if provided
                users = userRepository.findAll().stream()
                        .filter(user -> user.getRole() == role)
                        .collect(Collectors.toList());
            } else {
                // Get all users
                users = userRepository.findAll();
            }

            // Convert to DTOs (excludes password field)
            List<UserDTO> userDTOs = users.stream()
                    .map(UserDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get user by ID (Admin only)
     * @param id User ID
     * @return full user details
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }
            
            return ResponseEntity.ok(new UserDTO(user));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * GET /api/users/count
     * Get total number of users
     * @return Total count
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        try {
            long count = userRepository.count();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get the profile of the currently authenticated user
     * @param userDetails
     * @return UserProfileResponse with user details
     */
    @PreAuthorize("hasRole('HOMEOWNER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    @GetMapping("/me")
    public UserProfileResponse getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
         return userService.getUserProfile(userDetails.getUsername());
    }

    /**
     * Update the profile of the currently authenticated user
     * @param userDetails
     * @param request
     * @return UserProfileResponse with updated user details
     */
    @PreAuthorize("hasRole('HOMEOWNER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    @PutMapping("/me")
    public UserProfileResponse updateUserProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                  @RequestBody UpdateUserRequest request) {
        String email = userDetails.getUsername();
        return userService.updateUserProfile(email, request);
    }

    /**
     * Change password for the currently authenticated user
     * @param userDetails
     * @param request ChangePasswordRequest with current and new password
     * @return Success message or error
     */
    @PreAuthorize("hasRole('HOMEOWNER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            String email = userDetails.getUsername();
            userService.changePassword(email, request);
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Delete the account of the currently authenticated user
     * @param userDetails
     */
    @PreAuthorize("hasRole('HOMEOWNER') or hasRole('PROVIDER') or hasRole('ADMIN')")
    @DeleteMapping("/me")
    public void deleteUser(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        userService.deleteUser(email);
    }

    /**
     * Activate or deactivate a user account (Admin only)
     * @param id User ID
     * 
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public void updateUserStatus(@PathVariable Long id, @Valid @RequestBody UpdateUserStatusRequest request) {
        Boolean isActive = request.getIsActive();
        userService.updateUserStatus(id, isActive);
    }
}   