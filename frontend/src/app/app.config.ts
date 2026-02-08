/**
 * ANGULAR APPLICATION CONFIGURATION
 * ==================================
 * This file configures the Angular application providers.
 * 
 * LEARNING POINTS:
 * 
 * 1. ApplicationConfig (Angular 14+):
 *    - Modern way to configure standalone Angular apps
 *    - Replaces the old NgModule pattern
 *    - More modular and tree-shakeable
 * 
 * 2. Providers:
 *    - Services that Angular can inject into components
 *    - Angular's dependency injection system uses these
 *    - "Provide X" means "make X available for injection"
 * 
 * 3. provideRouter(routes):
 *    - Enables routing in the application
 *    - 'routes' comes from app.routes.ts
 *    - Allows navigation between different views/components
 * 
 * 4. provideHttpClient():
 *    - Makes HttpClient available for dependency injection
 *    - Required for making HTTP requests to backend
 *    - Without this, you'd get "No provider for HttpClient" error
 * 
 * 5. This config is used in:
 *    - main.ts: bootstrapApplication(AppComponent, appConfig)
 *    - It tells Angular what services are available app-wide
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * APPLICATION CONFIGURATION
 * Exported so it can be used in main.ts when bootstrapping the app
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Global error listener for better debugging
    provideBrowserGlobalErrorListeners(),

    // Router: Enables navigation between different views
    // (Not used in this simple app, but good to have for future growth)
    provideRouter(routes),

    // HttpClient: Enables HTTP requests to Spring Boot backend
    // This is ESSENTIAL - without it, http.get() and http.post() won't work!
    provideHttpClient()
  ]
};

/**
 * WHY NOT NgModule?
 * =================
 * Older Angular apps used NgModule (@NgModule decorator) to configure the app.
 * Standalone components (Angular 14+) use ApplicationConfig instead.
 * 
 * Benefits of ApplicationConfig:
 * - Simpler, less boilerplate
 * - Better tree-shaking (smaller bundle size)
 * - More modular and reusable
 * - Easier to test
 */
