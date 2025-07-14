# PubPlusAPI

PubPlusAPI is the backend service for the PubPlusUI application. It handles user authentication, status updates, and data retrieval. The API is built with Node.js, connected to a MySQL database, and follows a clean, modular architecture for scalability and maintainability.

---

## 🛠 Architecture

The project is structured following a clean separation of concerns:

- **Routes** – Handle incoming HTTP requests and map them to controllers  
- **Middlewares** – Includes token verification (auth) and error handling  
- **Controllers** – Manage request logic and validation  
- **Services** – Contain business logic for each domain  
- **Accessors** – Handle direct communication with the database (via MySQL)

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed  
- MySQL database set up (use credentials provided in the assignment email)

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the environment variables from the assignment email.

3. Start the API in development mode:

```bash
npm run dev
```

> ✅ Make sure your MySQL DB is running and matches the `.env` config.

---

## 🔐 API Overview

### Auth Endpoints

- `POST /auth/register`  
- `POST /auth/login`  
- `GET /auth/verify-token` ✅ (used in UI)

**Public Access:** All Auth endpoints except `verify-token` are public (no token required).  
Only `login` and `verify-token` are used by the UI.

---

### Home Endpoints (Require Auth Token)

- `GET /home` – Retrieve current user info and statuses  
- `GET /home/workers` – Fetch all workers and their current statuses  
  - Supports optional filters for name and status (sent from UI)
- `PUT /home/status` – Update current user’s status

> These routes require a valid token and are accessible only to authenticated users.

---

## 📌 Notes

- The API must be connected to the MySQL database for full functionality.  
- It stores and manages all worker data and authentication credentials.  
- Restart the API after any changes to `.env`.

---
