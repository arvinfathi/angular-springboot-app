<div align="center">

  <img src="cover.png" alt="Fullstack App Cover Image" width="100%" />

  <br/>
  <br/>

  <img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  
  <br/>

  <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-orange.svg?style=flat-square" alt="PRs Welcome" />

  <h1>Angular + Spring Boot + MongoDB - Learning Project</h1>
  
  <p>
    <b>A fullstack web application for learning Spring Boot + Angular + MongoDB</b>
  </p>

</div>

---

This project is designed as an educational resource for learning modern fullstack development with Java Spring Boot backend and Angular frontend.

## 🎯 Learning Objectives

By exploring this project, you'll learn:

- ✅ **Spring Boot 4.0** - REST API development, dependency injection, data persistence
- ✅ **Angular 17+** - Component architecture, data binding, HTTP client, standalone components
- ✅ **MongoDB** - NoSQL database with Spring Data MongoDB
- ✅ **Docker** - Multi-container orchestration with Docker Compose
- ✅ **Full-Stack Integration** - Connecting frontend, backend, and database

---

## 📁 Project Structure

```
angular-springboot-app/
├── backend/                    # Spring Boot Application (Java)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/rwin/financeportal/
│   │       │   ├── FinancePortalApplication.java  # Main entry point
│   │       │   ├── Transaction.java                # MongoDB entity
│   │       │   └── TransactionController.java      # REST API endpoints
│   │       └── resources/
│   │           └── application.properties          # Spring Boot configuration
│   ├── Dockerfile              # Multi-stage Docker build for backend
│   └── pom.xml                 # Maven dependencies
│
├── frontend/                   # Angular Application (TypeScript)
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts      # Main component (UI + logic)
│   │   │   ├── app.config.ts         # Angular configuration
│   │   │   └── app.routes.ts         # Routing configuration
│   │   └── main.ts                   # Angular bootstrap
│   ├── Dockerfile              # nginx-based production build
│   └── package.json            # npm dependencies
│
└── docker-compose.yml          # Orchestrates MongoDB + Backend + Frontend
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Java 21** (if running backend locally)
- **Node.js 18+** and **npm** (if running frontend locally)

### Option 1: Full Docker Setup (Recommended for Beginners)

```bash
# Clone the repository
git clone https://github.com/arvinfathi/angular-springboot-app.git
cd angular-springboot-app

# Start all services (MongoDB + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Backend API: http://localhost:8080/api/transactions
# Frontend: http://localhost (if frontend container is configured)
```

### Option 2: Development Setup (For Active Development)

**Terminal 1 - Start MongoDB:**
```bash
docker-compose up -d mongo
```

**Terminal 2 - Start Spring Boot Backend:**
```bash
cd backend
./mvnw spring-boot:run
# Or if you don't have Maven wrapper:
mvn spring-boot:run
```

**Terminal 3 - Start Angular Frontend:**
```bash
cd frontend
npm install
npm start
# Access at: http://localhost:4200
```

---

## 🎓 Architecture Overview

```
┌─────────────┐      HTTP Requests      ┌─────────────┐      MongoDB Wire Protocol      ┌─────────────┐
│   Angular   │ ──────────────────────► │ Spring Boot │ ────────────────────────────────► │   MongoDB   │
│  Frontend   │ ◄────────────────────── │   Backend   │ ◄──────────────────────────────── │  Database   │
│ (Port 4200) │      JSON Responses     │ (Port 8080) │      Query Results (BSON)        │ (Port 27017)│
└─────────────┘                         └─────────────┘                                    └─────────────┘
```

### Request Flow Example: Adding a Transaction

1. **User Action**: Fills form in Angular UI and clicks "Add Entry"
2. **Angular**: `http.post('/api/transactions', newTransaction)` → Sends JSON to backend
3. **Spring Boot**: Receives POST request at `@PostMapping("/api/transactions")`
4. **Controller**: Calls `repository.save(transaction)`
5. **Spring Data MongoDB**: Converts Java object to BSON and inserts into MongoDB
6. **MongoDB**: Saves document in `transactions` collection
7. **Response Path**: MongoDB → Spring Data → Controller → JSON → Angular → UI Update

---

## 🧩 Key Components Explained

### Backend (Spring Boot)

#### 1. **Transaction.java** - Entity Model
```java
@Data                                    // Lombok: Generates getters/setters
@Document(collection = "transactions")   // Maps to MongoDB collection
public class Transaction {
    @Id private String id;              // MongoDB ObjectId
    private String description;
    private BigDecimal amount;          // ✅ Use BigDecimal for money!
    private String type;                // INCOME or EXPENSE
    private LocalDate date;             // Modern Java date API
}
```

**Learning Points**:
- `@Data` (Lombok) eliminates boilerplate code
- `BigDecimal` for monetary values (never use `double`!)
- MongoDB `@Id` auto-generates unique identifiers

#### 2. **TransactionController.java** - REST API
```java
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @GetMapping                     // GET /api/transactions
    public List<Transaction> getAll() { return repo.findAll(); }
    
    @PostMapping                    // POST /api/transactions
    public Transaction add(@RequestBody Transaction t) { return repo.save(t); }
}
```

**Learning Points**:
- `@RestController` automatically converts Java objects to JSON
- `@RequestBody` deserializes JSON request to Java object
- Spring Data MongoDB provides `findAll()`, `save()` automatically

#### 3. **TransactionRepository** - Data Access
```java
interface TransactionRepository extends MongoRepository<Transaction, String> {
    // No code needed! Spring generates implementation automatically
    // Free methods: findAll(), save(), deleteById(), etc.
}
```

**Learning Points**:
- Spring Data generates database code from interfaces
- No SQL/MongoDB queries needed for basic CRUD
- Can add custom queries using method naming conventions

### Frontend (Angular)

#### 1. **app.component.ts** - Main Component
```typescript
@Component({
  selector: 'app-root',
  standalone: true,          // Modern Angular: No NgModule needed
  template: `...`,
  imports: [CommonModule, FormsModule]
})
export class AppComponent {
  transactions: any[] = [];
  
  ngOnInit() {
    this.loadData();  // Load on component initialization
  }
  
  loadData() {
    this.http.get<any[]>('/api/transactions').subscribe(data => {
      this.transactions = data;  // Update UI automatically
    });
  }
}
```

**Learning Points**:
- `ngOnInit()` lifecycle hook runs once on component creation
- `HttpClient` makes async requests to backend
- `subscribe()` handles async responses (RxJS Observable pattern)
- Template binding (`*ngFor`) automatically updates when data changes

#### 2. **Data Binding Examples**
```html
<!-- Two-way binding -->
<input [(ngModel)]="newTx.description">

<!-- Event binding -->
<button (click)="addTransaction()">Add</button>

<!-- Property binding -->
<td [style.color]="t.type === 'INCOME' ? 'green' : 'red'">

<!-- Structural directive -->
<tr *ngFor="let t of transactions">
```

### Database (MongoDB)

**Collections**:
- `transactions` - Stores financial transactions

**Example Document**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "description": "Client Payment",
  "amount": 2500.00,
  "type": "INCOME",
  "taxCategory": "TAX_DEDUCTIBLE",
  "date": "2026-02-08"
}
```

---

## 🔧 Configuration

### Spring Boot (application.properties)

```properties
# MongoDB connection (Spring Boot 4.0 format)
spring.mongodb.uri=mongodb://admin:secret@mongo:27017/finance-portal?authSource=admin
```

**Important Notes**:
- ⚠️ **Spring Boot 4.0 Change**: `spring.mongodb.uri` (not `spring.data.mongodb.uri`)
- `mongo` is the Docker service name (Docker DNS resolves it)
- `authSource=admin` authenticates against admin database

### Docker Compose

**Services**:
1. **mongo** - MongoDB database (port 27017)
2. **backend** - Spring Boot API (port 8080)
3. **frontend** - Angular app with nginx (port 80)

**Networking**:
- Docker creates an internal network
- Services communicate using service names (e.g., `mongo:27017`)
- Ports are mapped to localhost for external access

---

## 🛠️ Development Tools

### Database Access (DbGate)

Connect to MongoDB using:
- **Server**: `localhost`
- **Port**: `27017`
- **Username**: `admin`
- **Password**: `secret`
- **Auth Database**: `admin`
- **Database**: `finance-portal`

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f mongo

# Restart services
docker-compose restart backend

# Rebuild after code changes
docker-compose up -d --build

# Stop all services
docker-compose down

# Delete database (⚠️ deletes all data!)
docker-compose down -v
```

### Backend Development

```bash
# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# Run with Maven
./mvnw spring-boot:run

# Check dependencies
./mvnw dependency:tree
```

### Frontend Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## 📚 Learning Exercises

### Beginner Level

1. **Add Delete Functionality**
   - Backend: Add `@DeleteMapping("/{id}")` endpoint
   - Frontend: Add delete button in table
   - Learn about: Path variables, HTTP DELETE method

2. **Add Update Functionality**
   - Backend: Add `@PutMapping("/{id}")` endpoint
   - Frontend: Create edit form
   - Learn about: HTTP PUT, form validation

3. **Add Filtering**
   - Backend: Add custom repository method `findByType(String type)`
   - Frontend: Add dropdown to filter INCOME/EXPENSE
   - Learn about: Query methods, event handling

### Intermediate Level

4. **Calculate Totals**
   - Frontend: Add methods `getTotalIncome()`, `getTotalExpenses()`
   - Display totals above table
   - Learn about: Array methods (.reduce, .filter)

5. **Add Date Range Filter**
   - Backend: Add `findByDateBetween(LocalDate start, LocalDate end)`
   - Frontend: Add date pickers
   - Learn about: Date handling, query parameters

6. **Add Input Validation**
   - Backend: Use `@Valid` and validation annotations
   - Frontend: Implement form validation
   - Learn about: Bean validation, reactive forms

### Advanced Level

7. **Add User Authentication**
   - Backend: Implement Spring Security
   - Frontend: Create login/register pages
   - Learn about: JWT tokens, authentication guards

8. **Add Pagination**
   - Backend: Use `PagingAndSortingRepository`
   - Frontend: Implement page navigation
   - Learn about: Pagination, query parameters

9. **Add Charts/Visualizations**
   - Frontend: Integrate Chart.js or D3.js
   - Create income vs expense pie chart
   - Learn about: Third-party libraries, data transformation

---

## 🐛 Common Issues & Solutions

### Issue: Backend can't connect to MongoDB

**Symptom**: `MongoTimeoutException` or `Connection refused`

**Solution**:
1. Ensure MongoDB is running: `docker ps` should show `finance-mongo`
2. Check `application.properties` uses correct Spring Boot 4.0 format:
   ```properties
   spring.mongodb.uri=mongodb://admin:secret@mongo:27017/finance-portal?authSource=admin
   ```
3. Restart backend: `docker-compose restart backend`

### Issue: Angular table doesn't load on initial render

**Symptom**: Table appears empty until you type in form fields

**Solution**: Angular change detection issue. Ensure `ChangeDetectorRef` is used:
```typescript
constructor(private cdr: ChangeDetectorRef) {}

loadData() {
  this.http.get(...).subscribe(data => {
    this.transactions = data;
    this.cdr.detectChanges();  // Manually trigger update
  });
}
```

### Issue: CORS errors in browser console

**Symptom**: "Access-Control-Allow-Origin" error

**Solution**: For development, Angular proxy handles this. For production, add CORS configuration to Spring Boot:
```java
@CrossOrigin(origins = "http://localhost:4200")
@RestController
```

---

## 📖 Additional Resources

### Spring Boot
- [Official Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data MongoDB Guide](https://spring.io/projects/spring-data-mongodb)
- [REST API Best Practices](https://restfulapi.net/)

### Angular
- [Official Angular Documentation](https://angular.io/docs)
- [Angular HTTP Guide](https://angular.io/guide/http)
- [RxJS Observables](https://rxjs.dev/guide/overview)

### MongoDB
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB with Spring Boot](https://www.baeldung.com/spring-boot-mongodb)

### Docker
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Arvin Fathi**

This project is maintained as a learning resource for fullstack development.

---

## 🙏 Acknowledgments

- Spring Boot team for the amazing framework
- Angular team for the modern frontend framework
- MongoDB for the flexible NoSQL database
- Docker for simplified deployment

---

**Happy Learning! 🚀**

If you find this project helpful, please consider giving it a ⭐ on GitHub!
