# HomeLink Service Hub

Full-stack marketplace platform connecting homeowners with service providers through secure service requests, job management workflows, and payment processing.

## Overview

HomeLink is a full-stack marketplace application designed to connect homeowners with service professionals such as plumbers, electricians, cleaners, and landscapers.

Originally developed from a university capstone concept, the platform was re-architected into a deployable full-stack application featuring secure authentication, role-based access control, cloud deployment, and end-to-end service management workflows.

## Key Features

- Role-based access control for homeowners, service providers, and administrators
- JWT-secured authentication and authorization
- Service request creation and job lifecycle management
- Provider dashboards for request and workflow management
- Secure payment processing workflows
- Cloud deployment with a containerized backend and managed database
- Automated CI with GitHub Actions and Git-based continuous deployment
- Responsive user interface for multi-role user workflows

## Demo

Live Demo: [HomeLink Live Demo](https://homelink-servicehub.netlify.app/)

Portfolio Case Study: [View screenshots on GarrettV.com](https://garrettv.com/)

> The live demo runs on a cost-efficient, fully managed stack: an Angular frontend on Netlify, a containerized Spring Boot backend on Render, and managed MySQL on Aiven.
> The platform was originally architected and deployed on AWS (Elastic Beanstalk, RDS, S3, CloudFront) with GitHub Actions CI/CD, and the same application architecture is preserved across both.

## Project Status

Actively maintained with continued feature development and platform enhancements.

Focused on continued platform refinement, feature expansion, and production-quality engineering improvements.

## Highlights

* Designed and deployed a full-stack multi-role marketplace application using Angular, Spring Boot, MySQL, and AWS.
* Built CI/CD deployment automation using GitHub Actions and AWS Elastic Beanstalk.
* Implemented secure authentication and authorization using JWT and role-based access control.
* Engineered cloud-hosted frontend delivery through AWS CloudFront and S3 static asset distribution.
* Developed multi-role workflow support for homeowners, service providers, and administrative platform management.
* Migrated the platform from AWS to a portable, containerized stack (Docker, Render, Netlify, Aiven), reducing hosting cost to near zero while preserving the application architecture.

## Architecture

HomeLink follows a full-stack distributed architecture:

- Frontend: Angular (hosted on Netlify)
- Backend: Spring Boot RESTful API (containerized with Docker, hosted on Render)
- Database: MySQL (managed, hosted on Aiven)
- Authentication & Security: JWT Authentication + Role-Based Access Control (RBAC)
- Deployment Automation: GitHub Actions CI with Git-based auto-deploy
- Original AWS Deployment: Elastic Beanstalk, RDS, S3, CloudFront


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
* Node.js / npm

### Database
* MySQL

### Cloud & Hosting
* Netlify (frontend hosting)
* Render (containerized backend)
* Aiven (managed MySQL)
* Docker

### DevOps / Automation
* GitHub Actions CI
* Git-based continuous deployment (Netlify and Render)

### Prior AWS Deployment
* AWS Elastic Beanstalk, RDS, S3, CloudFront

### API & Security
* JWT Authentication
* Spring Security
* REST APIs

## Running Locally

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

