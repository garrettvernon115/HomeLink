# syntax=docker/dockerfile:1

# --- Build stage -------------------------------------------------------------
# Builds the Spring Boot jar inside the image so the host needs no local Maven.
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the POM first so dependency resolution is cached when only source changes.
COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

# --- Runtime stage -----------------------------------------------------------
# Slim JRE image that runs the packaged jar.
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# The app reads the PORT env var (see application.properties); hosts like Render
# inject it. EXPOSE is documentation only and does not pin the runtime port.
EXPOSE 8080

# SPRING_PROFILES_ACTIVE, DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET, and
# CORS_ALLOWED_ORIGINS are supplied as environment variables by the host.
ENTRYPOINT ["java", "-jar", "app.jar"]
