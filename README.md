# BloodBridge

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue)
![React](https://img.shields.io/badge/React-Planned-61DAFB)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)

A full-stack blood donation platform that connects hospitals with eligible blood donors during critical blood shortages through a structured request and application workflow.

---

## Problem Statement

During medical emergencies, hospitals often struggle to locate eligible blood donors quickly. Traditional approaches rely on phone calls, spreadsheets, social media posts, and personal networks, making the process slow, fragmented, and difficult to scale.

BloodBridge aims to streamline this process by providing a centralized platform where hospitals can create blood requests and donors can respond through a structured workflow.

---

## Why BloodBridge?

Blood donation is a time-sensitive problem where every minute matters. BloodBridge is designed to simplify communication between hospitals and donors while providing a clear process for creating requests, reviewing donor applications, and fulfilling urgent blood requirements.

---

## Workflow

```text
Hospital Registers
        │
        ▼
Creates Blood Request
        │
        ▼
Eligible Donors View Requests
        │
        ▼
Donors Submit Applications
        │
        ▼
Hospital Reviews Applications
        │
        ▼
Accept / Reject Donors
        │
        ▼
Request Fulfilled
```

---

## Architecture

```text
React Frontend
        │
        ▼
REST APIs (Spring Boot)
        │
        ▼
Controllers
        │
        ▼
Services
        │
        ▼
Repositories
        │
        ▼
PostgreSQL Database
```

---

## Domain Model

```text
Hospital
    │ 1
    │
    ▼
BloodRequest
    ▲
    │
    │ N
DonationApplication
    ▲
    │
    │ N
Donor
```

### Core Entities

* Hospital
* Donor
* BloodRequest
* DonationApplication

---

## Tech Stack

### Frontend (Planned)

* React
* HTML
* CSS
* JavaScript

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate

### Database

* PostgreSQL

### Build Tool

* Maven

---

## Features Implemented

* Hospital registration API
* PostgreSQL integration
* Spring Data JPA repositories
* Service layer architecture
* RESTful API development
* Constructor-based dependency injection
* Entity relationships and foreign key mappings
* Domain-driven data model

---

## Roadmap

**Phase 1 — Core Workflow**
- Donor registration, blood request creation, application workflow, request status tracking

**Phase 2 — Intelligence**  
- Blood group compatibility matching, location-based donor filtering, request expiration handling

**Phase 3 — Auth & Notifications**  
- Authentication & authorization, email notifications, real-time WebSocket updates

**Phase 4 — Frontend**  
- React dashboard for hospitals and donors, admin panel, analytics
---

## Getting Started

### Prerequisites

* Java 21
* PostgreSQL
* Maven

### Clone the Repository

```bash
git clone https://github.com/kavya685/BloodBridge.git
cd BloodBridge
```

### Configure Database

Create your local configuration file and update the PostgreSQL credentials:

```text
src/main/resources/application.yaml
```

You may also create an `application-example.yaml` file to share the required configuration structure without exposing credentials.

### Run the Application

```bash
mvn spring-boot:run
```

The application will start on:

```text
http://localhost:8080
```

---

## Project Status

BloodBridge is currently under active development. The backend foundation has been implemented using Spring Boot and PostgreSQL. Current development is focused on the donor-request workflow, authentication system, and the React-based frontend experience for hospitals and donors.
