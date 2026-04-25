/**
 * User model representing a user in the system
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

/**
 * User roles in the system
 */
export enum UserRole {
  HOMEOWNER = 'HOMEOWNER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: UserRole;
}