/**
 * ANGULAR APPLICATION COMPONENT
 * ==============================
 * This is the root component of our Angular application.
 * It handles displaying and creating financial transactions.
 * 
 * LEARNING POINTS:
 * 
 * 1. Standalone Component (Angular 14+):
 *    - standalone: true means this component doesn't need NgModule
 *    - Newer, simpler way to create Angular apps
 *    - imports: [...] specifies what other modules this component uses
 * 
 * 2. Component Decorator (@Component):
 *    - selector: 'app-root' → This is used in index.html as <app-root></app-root>
 *    - template: Inline HTML (could also use templateUrl for external file)
 *    - styles: Inline CSS (could also use styleUrls for external file)
 * 
 * 3. Dependency Injection:
 *    - constructor(private http: HttpClient, private cdr: ChangeDetectorRef)
 *    - Angular automatically provides these services
 *    - 'private' makes them class properties
 * 
 * 4. Lifecycle Hooks:
 *    - ngOnInit() runs ONCE after component is created
 *    - Perfect place to load initial data from API
 * 
 * 5. Two-Way Data Binding:
 *    - [(ngModel)]="newTx.description" binds input value to property
 *    - Changes in input update newTx.description and vice versa
 * 
 * 6. Event Binding:
 *    - (click)="addTransaction()" calls method when button clicked
 * 
 * 7. Structural Directives:
 *    - *ngFor="let t of transactions" loops through array
 *    - Creates a <tr> for each transaction
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root', // Used in index.html: <app-root></app-root>
  standalone: true, // Modern Angular: No NgModule needed
  imports: [CommonModule, FormsModule], // CommonModule: *ngFor, *ngIf | FormsModule: [(ngModel)]
  template: `
    <div class="container">
      <h1>💰 Finance Portal</h1>

      <!-- 
        TRANSACTION FORM
        Using two-way data binding with [(ngModel)]
        When user types, newTx object is automatically updated
      -->
      <div class="card">
        <h3>New Transaction</h3>
        
        <!-- Two-way binding: input ↔ newTx.description -->
        <input 
          [(ngModel)]="newTx.description" 
          placeholder="Description (e.g. Server Cost)">
        
        <!-- Two-way binding: input ↔ newTx.amount -->
        <input 
          [(ngModel)]="newTx.amount" 
          type="number" 
          placeholder="Amount">
        
        <!-- Two-way binding: select ↔ newTx.type -->
        <select [(ngModel)]="newTx.type">
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <!-- Two-way binding: select ↔ newTx.taxCategory -->
        <select [(ngModel)]="newTx.taxCategory">
          <option value="NONE">No Tax Impact</option>
          <option value="TAX_DEDUCTIBLE">Tax Deductible</option>
          <option value="VAT">VAT</option>
        </select>

        <!-- Event binding: (click) triggers addTransaction() method -->
        <button (click)="addTransaction()">Add Entry</button>
      </div>

      <!-- 
        TRANSACTIONS TABLE
        *ngFor loops through each transaction
        [style.color] dynamically sets CSS color based on type
      -->
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Tax</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <!-- 
            *ngFor="let t of transactions"
            Creates a <tr> for each transaction in the array
            't' is the current transaction in the loop
          -->
          <tr *ngFor="let t of transactions">
            <td>{{ t.date }}</td>
            <td>{{ t.description }}</td>
            <!-- 
              Property binding: [style.color]
              Green for income, red for expense
              Ternary operator: condition ? trueValue : falseValue
            -->
            <td [style.color]="t.type === 'INCOME' ? 'green' : 'red'">{{ t.type }}</td>
            <td>{{ t.taxCategory }}</td>
            <!-- 
              Pipe: | currency:'GBP'
              Formats number as British pounds: 2500 → £2,500.00
            -->
            <td>{{ t.amount | currency:'GBP' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    /* Component-scoped CSS - only applies to this component */
    .container { 
      padding: 20px; 
      font-family: sans-serif; 
      max-width: 800px; 
      margin: 0 auto; 
    }
    .card { 
      background: #f4f4f4; 
      padding: 20px; 
      border-radius: 8px; 
      margin-bottom: 20px; 
    }
    input, select { 
      margin: 5px; 
      padding: 10px; 
      width: 30%; 
    }
    button { 
      background: #0056b3; 
      color: white; 
      padding: 10px 20px; 
      cursor: pointer; 
      border: none; 
      border-radius: 4px; 
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
    }
    th, td { 
      padding: 10px; 
      text-align: left; 
    }
  `]
})
export class AppComponent implements OnInit {

  /**
   * COMPONENT STATE
   * Array to hold all transactions from the backend
   * any[] means array of any type (not type-safe, but simple for learning)
   * Better: Create a Transaction interface in TypeScript
   */
  transactions: any[] = [];

  /**
   * NEW TRANSACTION FORM DATA
   * This object is bound to the form inputs via [(ngModel)]
   * When user types, these properties update automatically
   */
  newTx = {
    description: '',
    amount: 0,
    type: 'EXPENSE', // Default value
    taxCategory: 'NONE', // Default value
    date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  };

  /**
   * API ENDPOINT
   * Spring Boot backend is running on port 8080
   * Angular dev server proxies /api/* requests to localhost:8080
   * (proxy configuration would be in proxy.conf.json if needed)
   */
  private apiUrl = `${environment.apiUrl}/api/transactions`;

  /**
   * CONSTRUCTOR - DEPENDENCY INJECTION
   * Angular automatically injects these services:
   * - HttpClient: For making HTTP requests to backend
   * - ChangeDetectorRef: For manually triggering UI updates
   */
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * LIFECYCLE HOOK: ON INIT
   * Called once after component is created
   * Perfect place to load initial data
   */
  ngOnInit() {
    // Load data on component initialization
    this.loadData();
  }

  /**
   * LOAD TRANSACTIONS FROM BACKEND
   * Makes HTTP GET request to fetch all transactions
   * 
   * HOW IT WORKS:
   * 1. http.get() sends GET request to Spring Boot
   * 2. Spring Boot queries MongoDB and returns JSON
   * 3. Angular automatically converts JSON to JavaScript objects
   * 4. We store the result in this.transactions array
   * 5. *ngFor in template automatically updates the table
   */
  loadData() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      // 'next' is called when data arrives successfully
      next: (data) => {
        this.transactions = data; // Update component state
        console.log('Loaded transactions:', data);

        /**
         * MANUAL CHANGE DETECTION
         * Normally Angular auto-detects changes, but sometimes with
         * async operations it doesn't trigger. This forces it to recheck.
         * Not always necessary, but ensures UI updates immediately.
         */
        this.cdr.detectChanges();
      },
      // 'error' is called if request fails (network error, server error, etc.)
      error: (e) => console.error('Error fetching data', e)
    });
  }

  /**
   * ADD NEW TRANSACTION
   * Called when user clicks "Add Entry" button
   * 
   * HOW IT WORKS:
   * 1. http.post() sends POST request with newTx data as JSON
   * 2. Spring Boot receives JSON, converts to Transaction object
   * 3. Saves to MongoDB and returns the saved transaction (with ID)
   * 4. We reload all data to show the new transaction in table
   * 5. We reset the form fields to empty
   */
  addTransaction() {
    this.http.post(this.apiUrl, this.newTx).subscribe({
      // 'next' is called when transaction is created successfully
      next: (response) => {
        console.log('Transaction added:', response);

        // Reload data after successful POST to show new transaction
        this.loadData();

        // Reset form to default values
        this.newTx.description = '';
        this.newTx.amount = 0;

        // Trigger change detection to update form fields immediately
        this.cdr.detectChanges();
      },
      // 'error' is called if request fails
      error: (e) => console.error('Error adding transaction', e)
    });
  }

}

/**
 * LEARNING EXERCISES:
 * ===================
 * 1. Add a delete button for each transaction
 *    - Add (click)="deleteTransaction(t.id)" to template
 *    - Implement deleteTransaction(id) method
 *    - Use http.delete(`${this.apiUrl}/${id}`)
 * 
 * 2. Add input validation
 *    - Disable button if description is empty
 *    - Use [disabled]="!newTx.description" on button
 * 
 * 3. Add filtering
 *    - Create a dropdown to filter by INCOME/EXPENSE/ALL
 *    - Use *ngIf or filter() to show only selected type
 * 
 * 4. Create a Transaction interface
 *    - Define proper types instead of 'any'
 *    - interface Transaction { id: string; description: string; ... }
 * 
 * 5. Add total calculations
 *    - Create methods: getTotalIncome(), getTotalExpenses()
 *    - Display totals above the table
 * 
 * 6. Improve error handling
 *    - Show user-friendly error messages
 *    - Add a <div> with error message when request fails
 */