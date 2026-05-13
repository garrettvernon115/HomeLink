# HomeLink Service Hub

Full-stack marketplace platform connecting homeowners with service providers through secure service requests, job management workflows, and payment processing.

## Overview

HomeLink is a full-stack marketplace application designed to connect homeowners with service professionals such as plumbers, electricians, cleaners, and landscapers.

Originally developed from a university capstone concept, the platform was significantly re-architected and expanded into a deployable full-stack application featuring secure authentication, role-based access control, cloud deployment, and end-to-end service management workflows.

## Tech Stack

**Backend**

* Java 17

* Spring Boot 3.2+ (Hosted on AWS EC2)

* Maven

* MySQL (Hosted on AWS RDS Free Tier)

**Frontend**

* Angular 17+ (Hosted on AWS S3)

* npm 9+

## Set Up and Installation

## Quick Start
First, clone the repository and switch to the development branch.

```bash
git clone https://github.com/garrettvernon115/HomeLink.git
cd HomeLink
```

## 2. Set Up Backend
Navigate to the backend folder and start the Spring Boot server.
```bash

cd backend
mvn spring-boot:run
# NOTE: If you get "UnsupportedClassVersionError", run:
# mvn clean
# mvn spring-boot:run
```
## 3. Set Up Frontend
Open a separate terminal to launch the Angular user interface.
```bash
cd frontend
npm install
ng serve
```
## 4. **View The App**
Access the UI at: http://localhost:4200.


