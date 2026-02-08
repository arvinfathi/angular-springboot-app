# ============================================
# SPRING BOOT BACKEND DOCKERFILE
# ============================================
#
# This Dockerfile uses MULTI-STAGE BUILD pattern to:
# 1. Build the Java application (Stage 1)
# 2. Create a lightweight runtime image (Stage 2)
#
# BENEFITS:
# - Smaller final image (JRE instead of full JDK + Maven)
# - Faster deployments and less storage/bandwidth
# - More secure (fewer tools in production image)
#
# LEARNING POINTS:
# ----------------
#
# 1. Multi-Stage Build:
#    - Each FROM creates a new stage
#    - Earlier stages are discarded in final image
#    - Use --from=stagename to copy files between stages
#
# 2. Base Images:
#    - maven:3.9.6-eclipse-temurin-21: Full build environment (JDK + Maven)
#    - eclipse-temurin:21-jre-alpine: Lightweight runtime (JRE only, Alpine Linux)
#    - JRE is much smaller than JDK (~50 MB vs ~200 MB)
#
# 3. Layer Caching:
#    - Docker caches each layer (COPY, RUN, etc.)
#    - COPY pom.xml before COPY src optimizes rebuilds
#    - If pom.xml unchanged, Maven dependencies are cached
#
# 4. WORKDIR:
#    - Sets the working directory inside container
#    - All subsequent commands run from this directory
#    - Similar to 'cd /app' in shell

# ============================================
# STAGE 1: BUILD THE APPLICATION
# ============================================
# This stage compiles the Java code and packages it into a JAR file
# We use a full Maven image with JDK for building

FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set working directory
WORKDIR /app

# OPTIMIZATION: Copy pom.xml first for better caching
# If pom.xml doesn't change, Docker reuses cached layer with dependencies
# This makes rebuilds much faster
COPY pom.xml .

# OPTIMIZATION: Copy source code after pom.xml
# If only source code changes (not dependencies), Docker uses cached dependency layer
COPY src ./src

# Build the application into a JAR file
# - clean: Remove old build artifacts
# - package: Compile code, run tests, create JAR
# - -DskipTests: Skip running tests to speed up builds (not recommended for production!)
# Result: /app/target/FinancePortal-0.0.1-SNAPSHOT.jar (or similar name)
RUN mvn clean package -DskipTests

# ============================================
# STAGE 2: CREATE RUNTIME IMAGE
# ============================================
# This stage creates a minimal image with just the JRE and our JAR file
# The Maven and source code from Stage 1 are NOT included

FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy ONLY the compiled JAR from Stage 1
# --from=build: Copy from the 'build' stage we defined above
# /app/target/*.jar: Source path (in build stage)
# app.jar: Destination name (in this stage)
COPY --from=build /app/target/*.jar app.jar

# Define how to run the application
# When container starts, it runs: java -jar app.jar
# - java: Java Runtime Environment command
# - -jar: Run a JAR file
# - app.jar: The JAR file we copied from Stage 1
ENTRYPOINT ["java", "-jar", "app.jar"]

# ============================================
# HOW TO BUILD AND RUN THIS IMAGE
# ============================================
#
# BUILD:
# docker build -t finance-backend .
#
# RUN STANDALONE:
# docker run -p 8080:8080 finance-backend
#
# RUN WITH DOCKER COMPOSE (RECOMMENDED):
# docker-compose up -d
#
# INSPECT:
# docker images                    # List all images
# docker history finance-backend   # View image layers
# docker exec -it finance-backend sh  # Open shell in running container
#
# ============================================
# DOCKERFILE BEST PRACTICES
# ============================================
#
# 1. Use specific image versions (not 'latest')
#    ✅ maven:3.9.6-eclipse-temurin-21
#    ❌ maven:latest
#
# 2. Order commands from least-to-most frequently changed
#    ✅ COPY pom.xml → COPY src → RUN mvn
#    ❌ COPY src → COPY pom.xml → RUN mvn
#
# 3. Use multi-stage builds for smaller production images
#    ✅ Build stage (JDK) → Runtime stage (JRE)
#    ❌ Single stage with full JDK
#
# 4. Minimize layers (combine RUN commands when possible)
#    ✅ RUN apt-get update && apt-get install -y curl git
#    ❌ RUN apt-get update
#        RUN apt-get install -y curl
#        RUN apt-get install -y git
#
# 5. Use .dockerignore to exclude unnecessary files
#    (Similar to .gitignore but for Docker builds)