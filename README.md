# GenLearn - Recursive AI-Generated Education

GenLearn is an interactive educational web app that generates customizable recursive lessons using the Gemini API. This version includes full persistent storage powered by a local PostgreSQL database, structured in a hierarchical graph format.

## Database Setup & Initialization

GenLearn uses a local PostgreSQL database to store and synchronize sessions and node graphs.

### 1. Configure the Environment

Create or edit your `.env` or `.env.local` file in the root of the project. Specify your `DATABASE_URL` connection string.

**Option A: Unix Socket:**
Use this option if local TCP password connections fail:
```env
DATABASE_URL=postgres:///generative_osw?host=/var/run/postgresql
```

**Option B: TCP/IP Connection**
```env
DATABASE_URL=postgres://<username>:<password>@localhost:5432/generative_osw
```

Make sure your PostgreSQL server is running, and the database `generative_osw` has been created.

### 2. Table Schema Initialization

You can initialize the tables using `schema.sql` via `psql`:

```bash
psql -d generative_osw -f schema.sql
```

> **Note:** The server is also configured to automatically run `schema.sql` table-creation checks on startup, so if you run the Vite development server, the tables will be created automatically if they do not exist!

## Installation & Running

### 1. Install Dependencies
Install all package dependencies (including `pg` database driver and `uuid` modules):

```bash
npm install
```

### 2. Start the Development Server
Run the Vite development server. This runs the frontend on port 3000 and mounts the database API middleware:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.