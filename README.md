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
- Secure payment workflow integration
- Cloud-based deployment and infrastructure management
- Responsive user interface for multi-role user workflows

## Demo

Live Application: [HomeLink Live Demo](https://d2n5l44xq019o.cloudfront.net/)

Application Preview: [View screenshots on GarrettV.com](https://www.garrettv.com/)

## Project Status

Actively maintained with ongoing feature development and platform improvements.

## Highlights

* Designed and deployed a full-stack multi-role marketplace application using Angular, Spring Boot, MySQL, and AWS.
* Implemented secure authentication and authorization using JWT and role-based access control.
* Built CI/CD deployment automation using GitHub Actions and AWS Elastic Beanstalk.
* Engineered cloud-hosted frontend delivery through AWS CloudFront and S3 static asset distribution.

## Architecture

HomeLink follows a full-stack distributed architecture:

- Frontend: Angular
- Backend: Spring Boot REST API
- Database: MySQL
- Cloud Infrastructure: AWS EC2, RDS, S3, CloudFront
- Authentication & Security: JWT Authentication + Role-Based Access Control (RBAC)
- Deployment Automation: GitHub Actions CI/CD Pipelines


## Tech Stack

### Backend
* Java 17
* Spring Boot 3.2+
* Hibernate / JPA
* Maven

### Frontend
* Angular 17+
* TypeScript
* SCSS
* RxJS
* npm

### Database
* MySQL

### Cloud & Infrastructure
* AWS RDS (Managed MySQL)
* AWS S3 (Static Asset Hosting)
* AWS CloudFront
* AWS Elastic Beanstalk

### Security
* Role-Based Access Control (RBAC)

### DevOps / Automation
* GitHub Actions
* CI/CD Deployment Pipelines

### API & Security
* JWT Authentication
* Spring Security
* REST APIs

## Getting Started

### Clone Repository
Clone the repository locally:

```bash
git clone https://github.com/garrettvernon115/HomeLink.git
cd HomeLink
```

### Run Backend
```bash

cd backend
mvn spring-boot:run
```
### Run Frontend
```bash
cd frontend
npm install
ng serve
```
### Access Application
Open the application locally at `http://localhost:4200`

