package com.rwin.financeportal;

import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * TRANSACTION REST CONTROLLER
 * ============================
 * This class exposes REST API endpoints for managing transactions.
 * It handles HTTP requests from the frontend (Angular) and interacts with MongoDB.
 * 
 * LEARNING POINTS:
 * 
 * 1. @RestController:
 *    - Combines @Controller + @ResponseBody
 *    - Automatically serializes return values to JSON
 *    - Spring uses Jackson library to convert Java objects → JSON
 * 
 * 2. @RequestMapping("/api/transactions"):
 *    - Base URL for all endpoints in this controller
 *    - All methods in this class will have paths starting with /api/transactions
 * 
 * 3. Constructor Injection (Best Practice):
 *    - private final TransactionRepository repo;
 *    - Injected via constructor (Spring auto-detects single constructor)
 *    - Better than @Autowired field injection (easier to test, immutable)
 * 
 * 4. CRUD Operations:
 *    - GET /api/transactions → Read all
 *    - POST /api/transactions → Create new
 *    - (Missing: PUT for update, DELETE for delete - good learning exercise!)
 * 
 * 5. Repository Pattern:
 *    - TransactionRepository extends MongoRepository
 *    - Spring Data automatically implements findAll(), save(), etc.
 *    - No SQL/MongoDB query code needed!
 */
@CrossOrigin(origins = "${app.frontend.url}")
@RestController // Marks this as a REST API controller that returns JSON
@RequestMapping("/api/transactions") // Base path for all endpoints in this controller
public class TransactionController {
    
    /**
     * DEPENDENCY INJECTION
     * Spring automatically injects an implementation of TransactionRepository
     * The 'final' keyword makes this immutable after construction (best practice)
     */
    private final TransactionRepository repo;

    /**
     * CONSTRUCTOR INJECTION
     * Spring automatically calls this constructor and provides the repository
     * This is better than @Autowired field injection because:
     * - The field can be final (immutable)
     * - Easier to write unit tests (can pass mock)
     * - Makes dependencies explicit
     */
    public TransactionController(TransactionRepository repo) {
        this.repo = repo;
    }

    /**
     * GET ALL TRANSACTIONS
     * ====================
     * HTTP Method: GET
     * URL: http://localhost:8080/api/transactions
     * 
     * Example Response (JSON):
     * [
     *   {
     *     "id": "507f1f77bcf86cd799439011",
     *     "description": "Client Payment",
     *     "amount": 2500.00,
     *     "type": "INCOME",
     *     "taxCategory": "NONE",
     *     "date": "2026-02-08"
     *   }
     * ]
     * 
     * @return List of all transactions from MongoDB
     */
    @GetMapping // Shorthand for @RequestMapping(method = RequestMethod.GET)
    public List<Transaction> getAll() {
        // Spring Data MongoDB automatically implements findAll()
        // It queries: db.transactions.find({})
        return repo.findAll();
    }

    /**
     * CREATE NEW TRANSACTION
     * ======================
     * HTTP Method: POST
     * URL: http://localhost:8080/api/transactions
     * 
     * Example Request Body (JSON):
     * {
     *   "description": "Office Supplies",
     *   "amount": 150.00,
     *   "type": "EXPENSE",
     *   "taxCategory": "TAX_DEDUCTIBLE",
     *   "date": "2026-02-08"
     * }
     * 
     * @param t Transaction object (auto-deserialized from JSON request body)
     * @return Saved transaction with auto-generated ID
     * 
     * @RequestBody tells Spring to:
     * 1. Read the JSON from HTTP request body
     * 2. Convert it to a Transaction object (using Jackson)
     * 3. Pass it as the parameter 't'
     */
    @PostMapping // Shorthand for @RequestMapping(method = RequestMethod.POST)
    public Transaction add(@RequestBody Transaction t) {
        // Spring Data MongoDB automatically implements save()
        // It executes: db.transactions.insert(t)
        // MongoDB auto-generates the 'id' field if not present
        return repo.save(t);
    }
    
    // TODO (Learning Exercise):
    // Add these methods yourself:
    // - @PutMapping("/{id}") - Update existing transaction
    // - @DeleteMapping("/{id}") - Delete transaction
    // - @GetMapping("/{id}") - Get single transaction by ID
    // - @GetMapping("/income") - Get only income transactions
    // - @GetMapping("/expense") - Get only expense transactions
}

/**
 * TRANSACTION REPOSITORY INTERFACE
 * =================================
 * This interface defines how we interact with MongoDB.
 * 
 * LEARNING POINTS:
 * 
 * 1. Interface Only - No Implementation:
 *    - We just declare the interface
 *    - Spring Data MongoDB automatically creates the implementation at runtime
 *    - Uses Java proxies and reflection to generate the actual database code
 * 
 * 2. MongoRepository<Transaction, String>:
 *    - Transaction: The entity type we're managing
 *    - String: The type of the ID field (in Transaction class)
 * 
 * 3. Free Methods from MongoRepository:
 *    - findAll() → Get all documents
 *    - save(T entity) → Insert or update
 *    - findById(String id) → Get by ID
 *    - deleteById(String id) → Delete by ID
 *    - count() → Count all documents
 *    - and many more!
 * 
 * 4. Custom Queries (not used here, but useful to know):
 *    You can add custom methods by naming convention:
 *    - List<Transaction> findByType(String type);
 *    - List<Transaction> findByAmountGreaterThan(BigDecimal amount);
 *    - Spring Data auto-generates the MongoDB query from the method name!
 * 
 * 5. Why in the same file?
 *    - For simplicity in this learning project
 *    - In real projects, put this in a separate file: TransactionRepository.java
 */
interface TransactionRepository extends org.springframework.data.mongodb.repository.MongoRepository<Transaction, String> {
    // No methods needed! MongoRepository provides findAll(), save(), etc.
    // Spring Data MongoDB automatically implements this interface
    
    // Try adding these custom queries yourself (Spring will auto-implement them!):
    // List<Transaction> findByType(String type);
    // List<Transaction> findByDate(LocalDate date);
    // List<Transaction> findByAmountGreaterThan(BigDecimal amount);
}