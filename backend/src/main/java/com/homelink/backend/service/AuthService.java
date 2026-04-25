package com.homelink.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.homelink.backend.dto.AuthResponse;
import com.homelink.backend.dto.LoginRequest;
import com.homelink.backend.dto.RegisterRequest;
import com.homelink.backend.model.User;
import com.homelink.backend.model.UserRole;
import com.homelink.backend.repository.UserRepository;
import com.homelink.backend.util.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Register a new user
     * @param request RegisterRequest with user details
     * @return AuthResponse with JWT token and email
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash password with BCrypt
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        
        // Set role (default to HOMEOWNER if not provided)
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                user.setRole(UserRole.valueOf(request.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setRole(UserRole.HOMEOWNER);
            }
        } else {
            user.setRole(UserRole.HOMEOWNER);
        }
        
        user.setIsActive(true);

        // Save user to database
        userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        // Return response with token, userId, email, and role
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole());
    }

    /**
     * Login user with credentials
     * @param request LoginRequest with email and password
     * @return AuthResponse with JWT token and email
     */
    public AuthResponse login(LoginRequest request) {
        // Authenticate user with Spring Security
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Load user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Get the full User entity to access ID and role
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);

        // Return response with token, userId, email, and role
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole());
    }
}
