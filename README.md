# Project Documentation

This project consists of two main parts:

1. **Frontend**: Built with React.
2. **Backend**: Built with PHP using Routify and Doctrine ORM.

## General Setup

### Prerequisites

- Node.js and npm installed.
- PHP 8.x or later.
- Composer installed.
- MySQL/MariaDB.

### Setup Instructions

#### Backend

1. **Create Database User and Schema**:

   - Create a MySQL user and schema.
   - Example SQL:
     ```sql
     CREATE DATABASE flow_order;
     CREATE USER 'flow_order'@'localhost' IDENTIFIED BY 'your_password';
     GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER ON flow_order.* TO 'flow_order'@'localhost';
     FLUSH PRIVILEGES;
     ```

2. **Environment File**:

   - Navigate to the `/backend/` directory.
   - Create a `.env` file based on `.env.example`.
   - Example `.env` content:
     ```env
     DB_HOST="127.0.0.1"
     DB_USERNAME="flow_order"
     DB_PASSWORD="your_password"
     DB_SCHEMA="flow_order"
     ALLOWED_ORIGIN="the_frontend_origin"
     ROUTIFY_SERVER_HOST="127.0.0.1"
     ROUTIFY_SERVER_PORT=8080
     ROUTIFY_SERVER_RATE_LIMIT=50
     ROUTIFY_SERVER_RATE_LIMIT_TIME_FRAME=60
     ```
     - Replace `your_password` with the database password.
     - Replace `the_frontend_origin` with the frontend’s origin (e.g., `http://localhost:3000`).

3. **Install Dependencies**:

   ```bash
   composer install
   ```

4. **Run Database Migrations**:

   ```bash
   php vendor/bin/doctrine-migrations migrate
   ```

5. **Start Development Server**:
   ```bash
   nodemon
   ```

#### Frontend

1. **Install Dependencies**:
   Navigate to the `/frontend/` directory and run:

   ```bash
   npm install
   ```

2. **Update Configuration (If Necessary)**:

   - Modify `/frontend/src/Constants/Endpoints.tsx` to set the correct `BASE_URL` for the Routify backend.
     Example:
     ```typescript
     export const BASE_URL = "http://127.0.0.1:8080/api";
     ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Additional Notes

- Ensure that the backend and frontend are running simultaneously during development.
- For production, configure environment variables and ensure proper deployment strategies for both frontend and backend.
