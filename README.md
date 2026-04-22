# Generative OS

A browser-based Generative Linux desktop environment that allows recursive generation and persistence of application states, completely backed by PostgreSQL.

## Prerequisites

Before starting the application, ensure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **npm** (Node Package Manager)
- **PostgreSQL** (v13 or higher)

## First-time Setup

If you are running this on a new device, follow these steps to set up the environment.

### 1. Database Setup
You need a PostgreSQL database. You can quickly set this up using the provided `schema.sql` file via the terminal:

```bash
# Connect to PostgreSQL and run the schema file
psql -U postgres -f schema.sql
```

*(Note: The application's Node.js backend will also automatically attempt to create the required `app_nodes` table when the server starts if it does not exist, but running `schema.sql` ensures the database `generative_os` itself is created first.)*

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your credentials:

```env
# Your Gemini API Key for generations
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL connection string
# Format: postgres://<username>:<password>@<host>:<port>/<database_name>
DATABASE_URL=postgres://postgres:password@localhost:5432/generative_os
```

### 3. Install Dependencies
Run the following command to install all required packages for both the frontend and backend:

```bash
npm install
```

## Running the Application

To start both the Vite frontend development server and the Express backend database server simultaneously, simply run:

```bash
npm run dev
```

You should see output confirming that the "PostgreSQL Database connected and schema verified" and that Vite is running on `http://localhost:3000`.

## Features
- **Recursive Content Generation:** Each application acts as a self-contained HTML seed that can branch content via the OS-level UI agent.
- **PostgreSQL Persistence:** All recursive states, interactions, and HTML screens are automatically compressed with `zlib` and stored safely in the database, allowing you to close and restore applications effortlessly.
- **Cascading Deletions:** Fully supports branch deletions that automatically clear out sub-branches to keep the database tidy.
