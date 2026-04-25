package com.homelink.backend.model;

/**
 * Enum representing the different pricing types for services
 */
public enum PriceType {
    /**
     * Fixed price for the entire service
     */
    FIXED,
    
    /**
     * Hourly rate pricing
     */
    HOURLY,
    
    /**
     * Price requires a custom quote from provider
     */
    QUOTE
}