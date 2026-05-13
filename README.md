# HomeLink Service Hub

Full-stack marketplace platform connecting homeowners with service providers through secure service requests, job management workflows, and payment processing.

## Overview

HomeLink is a full-stack marketplace application designed to connect homeowners with service professionals such as plumbers, electricians, cleaners, and landscapers.

Originally developed from a university capstone concept, the platform was significantly re-architected and expanded into a deployable full-stack application featuring secure authentication, role-based access control, cloud deployment, and end-to-end service management workflows.

## Key Features

- Role-based access control for homeowners, service providers, and administrators
- JWT-secured authentication and authorization
- Service request creation and job lifecycle management
- Provider dashboards for request and workflow management
- Payment processing workflows
- Cloud deployment using AWS infrastructure
- CI/CD automation with GitHub Actions

## Tech Stack
## Architecture

HomeLink follows a full-stack distributed architecture:

Angular Frontend
↓
Spring Boot REST API
↓
MySQL Database
↓
AWS Infrastructure (EC2, RDS, S3, CloudFront)

### Backend
* Java 17
* Spring Boot 3.2+
* Maven
* MySQL

### Frontend
* Angular 17+
* TypeScript
* SCSS
* npm

### Cloud & Infrastructure
* AWS EC2
* AWS RDS
* AWS S3
* AWS CloudFront

### Security
* JWT Authentication
* Role-Based Access Control (RBAC)

### DevOps / Automation
* GitHub Actions
* CI/CD Pipelines

## Getting Started

## Quick Start
First, clone the repository and switch to the development branch.

```bash
git clone https://github.com/garrettvernon115/HomeLink.git
cd HomeLink
```

## Run Backend
Navigate to the backend folder and start the Spring Boot server.
```bash

cd backend
mvn spring-boot:run
```
## Run Frontend
Open a separate terminal to launch the Angular user interface.
```bash
cd frontend
npm install
ng serve
```
## Run Application
