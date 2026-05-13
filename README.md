# HomeLink

### Project Description  
HomeLink is a web-based marketplace for home services that connects homeowners with service providers such as plumbers, electricians, cleaners, and landscapers. It supports three user roles (homeowner, service provider, admin) and enables service browsing, booking management, secure payments, and provider reviews.


## Prerequisites

**Backend**

* Java 17

* Spring Boot 3.2+ (Hosted on AWS EC2)

* Maven

* MySQL (Hosted on AWS RDS Free Tier)

**Frontend**

* Angular 17+ (Hosted on AWS S3)

* npm 9+

**Development Tools**

* VSCode (recommended)

* Git & GitHub

## Set Up and Installation

**Installation Steps**
* Download and install:
* JDK 17 - https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
* Maven - https://maven.apache.org/download.cgi
  * Extract to C:\Program Files\
  * Copy path of apache folder
  * Search for "Edit the system environment variables" click on environment variables, under System Variables highlight "Path" then Edit.
  * Paste apache folder path and add a \bin
* Node.js - https://nodejs.org/en
* Angular CLI
  * Open command prompt. npm install -g @angular/cli
* MySQL 8.0
  * Full install → Set root password → Add bin folder to system PATH
* Git - git-scm.com/download/win
* VS Code - https://code.visualstudio.com/

## 1. Clone & Branch
First, clone the repository and switch to the development branch.

```bash
# Clone the repository
git clone [https://github.com/FranklinUniversityCompSciPracticum/2026_Spring_Team1_Repo.git](https://github.com/FranklinUniversityCompSciPracticum/2026_Spring_Team1_Repo.git)

# Enter the project directory
cd 2026_Spring_Team1_Repo

# Switch to the develop branch
git checkout develop
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


## Git Workflow
Follow these steps to ensure your local code is synchronized with the team's progress.

Update Develop and Create Feature Branch
Always start by pulling the latest changes from the shared develop branch before starting new work.
```bash
git checkout develop
```
```bash
git pull
```
```bash
git checkout -b feature/your-ticket-name
```
## Finished Work: Commit and Push
Once your ticket is complete, stage your changes and push them to the remote repository.
```bash
git add .
```
```bash
git commit -m "ticket name"
```
```bash
git push -u origin feature/your-ticket-name
```
## Open Pull Request into develop on GitHub
Go to the GitHub repository website to open a Pull Request (PR) from your feature branch into develop for review.

## Verify Installs 
Run these commands in your terminal to ensure your environment meets the project prerequisites.
 ```bash
java -version
```
 ```bash
mvn -version
```
 ```bash
node -v
```
 ```bash
ng version
```
 ```bash
mysql --version
```
 ```bash
git --version
```
