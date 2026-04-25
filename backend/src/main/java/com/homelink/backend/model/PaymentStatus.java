package com.homelink.backend.model;

/**
 * Enum representing the status of a payment transaction
 */
public enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED
}