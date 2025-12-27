# Protected Routes

## What are Protected Routes?
Protected routes require authentication - users must be logged in to access them. Like a VIP section that requires an ID card.

## Why Protect Routes?
- **Privacy**: Users only see their own data
- **Security**: Prevents unauthorized access
- **User experience**: Personal data for each user
- **Industry standard**: All apps protect user data

## Key Concepts:

### 1. Understanding Middleware

**What is middleware?**
- Functions that run before route handlers
- Can modify request/response
- Can stop request (if not authorized)
- Can pass to next middleware/route

**Middleware flow:**
```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

**Example:**
```javascript
// Middleware runs first
app.use((req, res, next) => {
    console.log('Request received');
    next(); // Continue to next middleware/route
});

// Route handler runs after middleware
app.get('/tasks', (req, res) => {
    res.json(tasks);
});
```

### 2. Authentication Middleware

**Complete authenticateToken middleware:**
```javascript
const jwt = require('jsonwebtoken');

// This middleware verifies JWT token
// It runs before protected routes
const authenticateToken = (req, res, next) => {
    // Step 1: Get Authorization header
    // Format: "Bearer TOKEN"
    // req.headers['authorization'] gets the header value
    const authHeader = req.headers['authorization'];
    
    // Step 2: Extract token from "Bearer TOKEN"
    // authHeader.split(' ') splits by space → ['Bearer', 'TOKEN']
    // [1] gets the second part (the token)
    // If no header, authHeader is undefined, so token is null
    const token = authHeader && authHeader.split(' ')[1];
    
    // Step 3: Check if token exists
    // If no token, user is not authenticated
    if (!token) {
        // Return 401 (Unauthorized) and stop here
        // Request doesn't continue to route handler
        return res.status(401).json({ error: 'Access token required' });
    }
    
    // Step 4: Verify token
    // jwt.verify() checks if token is valid and not expired
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // If token is invalid or expired, err is set
        if (err) {
            // Return 403 (Forbidden) and stop here
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        
        // Step 5: Token is valid!
        // user contains payload data from token (userId, email)
        // Add user info to request object
        // Now route handlers can access req.user
        req.user = user;
        
        // Step 6: Continue to route handler
        // next() passes control to the next middleware or route handler
        // Without this, request stops here
        next();
    });
};
```

**What happens step by step:**
1. Request comes in with token
2. Middleware extracts token from header
3. Checks if token exists
4. Verifies token signature and expiration
5. If valid, adds user info to `req.user`
6. Calls `next()` to continue
7. Route handler can use `req.user`

### 3. Protecting Routes

**Apply middleware to routes:**
```javascript
// Unprotected route - anyone can access
app.post('/register', async (req, res) => {
    // No middleware, anyone can register
});

app.post('/login', async (req, res) => {
    // No middleware, anyone can login
});

// Protected route - requires authentication
// authenticateToken runs BEFORE the route handler
// If token invalid, request stops at middleware
app.get('/tasks', authenticateToken, async (req, res) => {
    // This code only runs if token is valid
    // req.user contains user info from token
    const userId = req.user.userId;
    
    // Get only this user's tasks
    const result = await pool.query(
        'SELECT * FROM tasks WHERE user_id = $1',
        [userId]
    );
    res.json(result.rows);
});
```

**Multiple protected routes:**
```javascript
// All these routes require authentication
app.get('/tasks', authenticateToken, async (req, res) => {
    // Get user's tasks
});

app.post('/tasks', authenticateToken, async (req, res) => {
    // Create task for this user
    const userId = req.user.userId;
    // ...
});

app.put('/tasks/:id', authenticateToken, async (req, res) => {
    // Update task (only if user owns it)
    const userId = req.user.userId;
    // ...
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    // Delete task (only if user owns it)
    const userId = req.user.userId;
    // ...
});
```

### 4. User-Specific Data

**Always filter by user_id:**
```javascript
// GET tasks - only user's tasks
app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        // req.user.userId comes from token
        // This ensures user only sees their own tasks
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY "createdAt" DESC',
            [req.user.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create task - automatically belongs to user
app.post('/tasks', authenticateToken, async (req, res) => {
    try {
        const { title, description } = req.body;
        // user_id comes from token, not request body
        // User can't create tasks for other users
        const result = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, req.user.userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

### 5. Protecting Update/Delete

**Ensure users can only modify their own tasks:**
```javascript
// PUT update task
app.put('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { title, completed } = req.body;
        const taskId = req.params.id;
        const userId = req.user.userId;
        
        // Update only if task belongs to user
        // WHERE id = $3 AND user_id = $4 ensures user owns the task
        const result = await pool.query(
            'UPDATE tasks SET title = $1, completed = $2, "updatedAt" = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
            [title, completed, taskId, userId]
        );
        
        // If no rows updated, task doesn't exist or doesn't belong to user
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE task
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.userId;
        
        // Delete only if task belongs to user
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
            [taskId, userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

**Why AND user_id?**
- Prevents users from modifying other users' tasks
- Even if they know the task ID
- Security: always verify ownership

### 6. Complete Protected API Example

**server.js:**
```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Public routes (no authentication needed)
app.post('/register', async (req, res) => {
    // Registration logic
});

app.post('/login', async (req, res) => {
    // Login logic
});

// Protected routes (require authentication)
app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1',
            [req.user.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', authenticateToken, async (req, res) => {
    try {
        const { title, description } = req.body;
        const result = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, req.user.userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { title, completed } = req.body;
        const result = await pool.query(
            'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [title, completed, req.params.id, req.user.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
            [req.params.id, req.user.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000);
```

### 7. Testing Protected Routes

**Without token (should fail):**
```bash
# This should return 401 Unauthorized
curl http://localhost:3000/tasks
```

**With token (should work):**
```bash
# First login to get token
TOKEN=$(curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Then use token to get tasks
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Error Handling

**Different error scenarios:**
```javascript
// No token provided
// Returns: 401 { error: 'Access token required' }

// Invalid token
// Returns: 403 { error: 'Invalid token' }

// Expired token
// Returns: 403 { error: 'Invalid token' }

// Valid token, but task doesn't belong to user
// Returns: 404 { error: 'Task not found' }
```

## Practice:
1. Create authenticateToken middleware
2. Protect GET /tasks route
3. Protect POST /tasks route
4. Protect PUT /tasks/:id route
5. Protect DELETE /tasks/:id route
6. Test with Postman (with and without token)
7. Verify users can only see their own tasks

## Security Checklist:
- ✅ All protected routes use authenticateToken middleware
- ✅ All queries filter by user_id
- ✅ Update/Delete verify ownership (AND user_id)
- ✅ Error messages don't reveal too much info
- ✅ Tokens expire after set time

## Next Steps:
Now that backend is secure, we'll connect the frontend to use authentication!

