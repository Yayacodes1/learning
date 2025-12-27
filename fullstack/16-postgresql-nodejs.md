# PostgreSQL with Node.js

## Connecting Database to Your App
Now that you have PostgreSQL set up, let's connect it to your Node.js Express app. This replaces your in-memory array with a real database.

## Why Connect Database to Node.js?
- **Persistent storage**: Data survives server restarts
- **Multiple users**: Can handle many users at once
- **Scalable**: Can store millions of records
- **Real-world**: This is how production apps work

## Key Concepts:

### 1. Installing Required Packages

**Install pg and dotenv:**
```bash
# pg is the PostgreSQL client for Node.js
# It lets Node.js talk to PostgreSQL database
npm install pg

# dotenv loads environment variables from .env file
# This keeps your database password secret
npm install dotenv
```

**What each package does:**
- `pg` - PostgreSQL client library (lets Node.js connect to PostgreSQL)
- `dotenv` - Loads `.env` file (keeps secrets out of code)

### 2. Creating Database Connection File

**Create `db.js` file:**
```javascript
// Load environment variables from .env file
// This reads DATABASE_URL from .env without exposing it in code
require('dotenv').config();

// Import Pool from pg library
// Pool manages multiple database connections efficiently
const { Pool } = require('pg');

// Create a connection pool
// Pool reuses connections instead of creating new ones each time
// This is more efficient than creating connections manually
const pool = new Pool({
    // connectionString gets the database URL from .env file
    // process.env.DATABASE_URL reads the DATABASE_URL variable
    connectionString: process.env.DATABASE_URL
});

// Export pool so other files can use it
// Other files can require('./db') to get the pool
module.exports = pool;
```

**What Pool does:**
- Manages multiple database connections
- Reuses connections (faster than creating new ones)
- Handles connection errors automatically
- Limits number of connections (prevents overload)

### 3. Setting Up Environment Variables

**Create `.env` file in your project root:**
```
# Database connection string from Supabase
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://postgres:yourpassword@db.xxx.supabase.co:5432/postgres

# Server port (optional, defaults to 3000)
PORT=3000
```

**What `.env` does:**
- Stores secrets (passwords, API keys)
- Not committed to Git (stays private)
- Each developer can have different values
- Easy to change for different environments (dev, production)

**Add `.env` to `.gitignore`:**
```
# .gitignore
node_modules/
.env
*.log
```

**Why `.gitignore`?**
- Prevents committing secrets to Git
- Keeps passwords private
- Each developer uses their own `.env`

### 4. Replacing Array with Database Queries

**Before (using array):**
```javascript
// Old way: storing tasks in memory
let tasks = [];

app.get('/tasks', (req, res) => {
    // Just return the array
    res.json(tasks);
});
```

**After (using database):**
```javascript
// Import the database pool
// This gives us access to the database connection
const pool = require('./db');

app.get('/tasks', async (req, res) => {
    try {
        // pool.query() sends SQL query to PostgreSQL
        // 'SELECT * FROM tasks' means "get all columns from tasks table"
        // await waits for database to respond before continuing
        const result = await pool.query('SELECT * FROM tasks');
        
        // result.rows contains array of task objects from database
        // Each row from database becomes an object in the array
        res.json(result.rows);
    } catch (err) {
        // If database query fails, send error response
        // 500 means server error
        res.status(500).json({ error: err.message });
    }
});
```

**What changed:**
- `let tasks = []` → Removed (no longer needed)
- `res.json(tasks)` → `res.json(result.rows)` (data from database)
- Added `async/await` (database queries are asynchronous)
- Added `try/catch` (handles database errors)

### 5. GET All Tasks

**Complete example:**
```javascript
const express = require('express');
// Import database pool from db.js
const pool = require('./db');

const app = express();
app.use(express.json());

// GET /tasks - Get all tasks from database
app.get('/tasks', async (req, res) => {
    try {
        // Send SQL query to database
        // SELECT * FROM tasks gets all rows from tasks table
        // await waits for database response
        const result = await pool.query('SELECT * FROM tasks');
        
        // result.rows is array of task objects
        // Each object has: id, title, description, completed, createdAt, updatedAt
        // Send tasks array as JSON response
        res.json(result.rows);
    } catch (err) {
        // If something goes wrong (database error, connection issue)
        // Send error response with status 500 (server error)
        res.status(500).json({ error: err.message });
    }
});
```

**What happens step by step:**
1. Client sends GET request to `/tasks`
2. Express route handler runs
3. `pool.query()` sends SQL to PostgreSQL
4. Database executes query and returns results
5. `result.rows` contains array of tasks
6. `res.json()` sends tasks to client

### 6. GET Task by ID

**Get single task:**
```javascript
app.get('/tasks/:id', async (req, res) => {
    try {
        // req.params.id gets the id from URL (e.g., /tasks/5 → id = "5")
        // $1 is a placeholder for the first parameter (prevents SQL injection)
        // [req.params.id] is the array of values to replace $1
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [req.params.id]
        );
        
        // If no task found, result.rows.length is 0
        // Return 404 (not found) error
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        // result.rows[0] is the first (and only) task object
        // Send single task as JSON
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

**Why `$1` instead of string interpolation?**
```javascript
// ❌ Bad - SQL injection risk!
// If user sends id = "1; DROP TABLE tasks;"
// This would delete your entire table!
pool.query(`SELECT * FROM tasks WHERE id = ${req.params.id}`);

// ✅ Good - Parameterized query
// $1 is safely replaced with the value
// Database treats it as data, not SQL code
pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
```

### 7. POST Create Task

**Create new task:**
```javascript
app.post('/tasks', async (req, res) => {
    try {
        // Destructure title and description from request body
        // req.body contains JSON data sent by client
        const { title, description } = req.body;
        
        // INSERT INTO adds new row to tasks table
        // (title, description) lists columns to fill
        // VALUES ($1, $2) uses parameters for safety
        // RETURNING * means "return the created row"
        const result = await pool.query(
            'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        
        // result.rows[0] is the newly created task
        // Status 201 means "created successfully"
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

**What happens:**
1. Client sends POST with `{ title: "New task", description: "..." }`
2. Database inserts new row
3. Database returns the created row (with id, timestamps)
4. Server sends created task back to client

### 8. PUT Update Task

**Update existing task:**
```javascript
app.put('/tasks/:id', async (req, res) => {
    try {
        // Get data from request body
        const { title, completed } = req.body;
        
        // UPDATE modifies existing row
        // SET changes title and completed columns
        // NOW() sets updatedAt to current timestamp
        // WHERE id = $3 only updates the task with matching id
        // RETURNING * returns the updated row
        const result = await pool.query(
            'UPDATE tasks SET title = $1, completed = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *',
            [title, completed, req.params.id]
        );
        
        // If no task found, result.rows.length is 0
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        // Send updated task back
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

### 9. DELETE Task

**Delete task:**
```javascript
app.delete('/tasks/:id', async (req, res) => {
    try {
        // DELETE removes row from table
        // WHERE id = $1 only deletes task with matching id
        // RETURNING * returns the deleted row (before deletion)
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        
        // If no task found, return 404
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        // Send success message
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

### 10. Complete Example

**server.js:**
```javascript
const express = require('express');
// Import database connection pool
const pool = require('./db');

const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());

// GET all tasks
app.get('/tasks', async (req, res) => {
    try {
        // Query database for all tasks
        const result = await pool.query('SELECT * FROM tasks ORDER BY "createdAt" DESC');
        // Send tasks array as JSON
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;
        const result = await pool.query(
            'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { title, completed } = req.body;
        const result = await pool.query(
            'UPDATE tasks SET title = $1, completed = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *',
            [title, completed, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

## Practice:
1. Install pg and dotenv packages
2. Create db.js with database connection
3. Create .env file with DATABASE_URL
4. Replace all array operations with database queries
5. Test each endpoint with Postman
6. Verify data persists after server restart

## Common Errors:

**"Cannot find module 'pg'":**
- Run `npm install pg`

**"Connection refused":**
- Check DATABASE_URL in .env
- Make sure database is running
- Verify connection string format

**"relation 'tasks' does not exist":**
- Table not created yet
- Run CREATE TABLE command in database

## Next Steps:
Now that your app uses a database, you can add authentication so users can have their own tasks!

