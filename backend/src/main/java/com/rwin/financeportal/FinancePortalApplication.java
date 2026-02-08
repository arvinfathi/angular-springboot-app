package com.rwin.financeportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * MAIN APPLICATION CLASS
 * =====================
 * This is the entry point for our Spring Boot application.
 * 
 * LEARNING POINTS:
 * 
 * 1. @SpringBootApplication Annotation:
 *    This is a convenience annotation that combines three important annotations:
 *    - @Configuration: Marks this class as a source of bean definitions
 *    - @EnableAutoConfiguration: Tells Spring Boot to automatically configure your app
 *    - @ComponentScan: Tells Spring to scan this package for components, services, controllers
 * 
 * 2. SpringApplication.run():
 *    This static method launches the Spring application. It:
 *    - Sets up the default configuration
 *    - Starts the embedded Tomcat server (default port: 8080)
 *    - Scans for @Component, @Service, @Repository, @Controller annotations
 *    - Creates the application context (dependency injection container)
 * 
 * 3. Package Structure:
 *    All our components are in the same package (com.rwin.financeportal)
 *    Spring will automatically find: Transaction.java, TransactionController.java, TransactionRepository
 * 
 * 4. No XML Configuration:
 *    Unlike older Spring applications, Spring Boot uses Java annotations instead of XML files
 *    This makes the code more readable and type-safe
 */
@SpringBootApplication
public class FinancePortalApplication {

	public static void main(String[] args) {
		// Start the Spring Boot application
		// This will launch an embedded Tomcat server and initialize all Spring components
		SpringApplication.run(FinancePortalApplication.class, args);
		
		// After this runs, your REST API will be available at: http://localhost:8080/api/transactions
	}

}
