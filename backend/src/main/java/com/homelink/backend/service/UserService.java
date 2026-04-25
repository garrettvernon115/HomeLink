package com.homelink.backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homelink.backend.dto.ChangePasswordRequest;
import com.homelink.backend.dto.UpdateUserRequest;
import com.homelink.backend.dto.UserProfileResponse;
import com.homelink.backend.model.User;
import com.homelink.backend.repository.UserRepository;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get user profile by email
     * @param email
     * @return UserProfileResponse with user details
     */
    public UserProfileResponse getUserProfile(String email) {
        return userRepository.findByEmail(email)
                .map(user -> new UserProfileResponse(
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getPhone(),
                        user.getRole().name()
                ))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Update user profile by email
     * @param email
     * @param request
     * @return UserProfileResponse with updated user details
     */
    public UserProfileResponse updateUserProfile(String email, UpdateUserRequest request) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
    
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhone(request.getPhone());
    
            userRepository.save(user);
    
            return new UserProfileResponse(
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getPhone(),
                    user.getRole().name()
            );
        }
    
    /**
     * Update usesr status (active/inactive)
     * @param id User ID
     */
    public void updateUserStatus(Long id, boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    /**
     * Change password for user
     * @param email User's email
     * @param request ChangePasswordRequest with current and new password
     */
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password and confirm password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    /**
     * Delete user by email
     * @param email
     */
    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(user != null) {
            userRepository.delete(user);
        }
    }
}
