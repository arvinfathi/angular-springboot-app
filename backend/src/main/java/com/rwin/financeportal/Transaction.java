package com.rwin.financeportal;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * TRANSACTION ENTITY/MODEL CLASS
 * ===============================
 * This class represents a financial transaction in our application.
 * It maps to the "transactions" collection in MongoDB.
 * 
 * LEARNING POINTS:
 * 
 * 1. @Data (Lombok):
 *    Automatically generates:
 *    - Getters for all fields (e.g., getId(), getDescription())
 *    - Setters for all fields (e.g., setId(), setAmount())
 *    - toString() method
 *    - equals() and hashCode() methods
 *    - Required args constructor
 *    This saves you from writing ~50 lines of boilerplate code!
 * 
 * 2. @Document (Spring Data MongoDB):
 *    - Marks this class as a MongoDB document
 *    - collection = "transactions" specifies the MongoDB collection name
 *    - Without this, Spring would use the class name as collection name
 * 
 * 3. @Id:
 *    - Marks the primary key field
 *    - MongoDB will auto-generate ObjectId values if not provided
 *    - String type is used because MongoDB IDs are strings (not integers)
 * 
 * 4. Field Types - Best Practices:
 *    - BigDecimal for money: NEVER use Double/Float for currency (precision issues!)
 *    - LocalDate for dates: Modern Java 8+ date API (no timezone issues)
 *    - String for IDs: MongoDB uses string-based ObjectIds
 * 
 * 5. No Business Logic Here:
 *    This is a "dumb" data class - it only holds data, no methods
 *    Business logic belongs in Service classes (we don't have one yet - keeping it simple)
 */
@Data // Lombok: Auto-generates getters, setters, toString, equals, hashCode
@Document(collection = "transactions") // MongoDB: Maps to "transactions" collection
public class Transaction {
    
    /**
     * PRIMARY KEY
     * MongoDB auto-generates this as a 24-character hex string (ObjectId)
     * Example: "507f1f77bcf86cd799439011"
     */
    @Id
    private String id;
    
    /**
     * TRANSACTION DESCRIPTION
     * Examples: "Freelance Work", "Office Supplies", "Client Payment"
     */
    private String description;
    
    /**
     * AMOUNT IN GBP
     * Using BigDecimal instead of double to avoid floating-point precision errors
     * Example: new BigDecimal("100.50") for £100.50
     * 
     * WHY NOT DOUBLE?
     * 0.1 + 0.2 = 0.30000000000000004 in double arithmetic! 
     * BigDecimal guarantees exact decimal precision for financial calculations
     */
    private BigDecimal amount;
    
    /**
     * TRANSACTION TYPE
     * Expected values: "INCOME" or "EXPENSE"
     * In a real app, you'd use an Enum instead of String for type safety
     */
    private String type;
    
    /**
     * TAX CATEGORY
     * Examples: "TAX_DEDUCTIBLE", "VAT", "NONE"
     * Used for tax reporting and calculations
     */
    private String taxCategory;
    
    /**
     * TRANSACTION DATE
     * Using LocalDate (not Date or Timestamp) for cleaner, modern Java date handling
     * Example: LocalDate.of(2026, 2, 8) or LocalDate.now()
     */
    private LocalDate date;
}