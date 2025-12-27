# JWT Tokens

## What is JWT?
JWT (JSON Web Token) is a way to prove a user is logged in. It's like a temporary ID card that expires after a set time.

## Why JWT Tokens?
- **Stateless**: Server doesn't need to store session data
- **Efficient**: No database lookup needed for each request
- **Secure**: Signed by server (can't be forged)
- **Portable**: Works across different servers

## Key Concepts:

### 1. How JWT Works

**The Flow:**
```
1. User logs in → Server verifies password
2. Server creates token → Contains user info (id, email)
3. Server signs token → With secret key (can't be forged)
4. Server sends token → To user
5. User stores token → In localStorage
6. User sends token → With every request
7. Server verifies token → Checks signature
8. Server allows access → If token is valid
```

**What's in a JWT?**
```
header.payload.signature

Header: Algorithm and type
Payload: User data (id, email)
Signature: Secret signature (proves authenticity)
```

### 2. Installing jsonwebtoken

**Install package:**
```bash
# jsonwebtoken creates and verifies JWT tokens
npm install jsonwebtoken
```

**What it does:**
- Creates tokens with user data
- Signs tokens with secret key
- Verifies tokens are valid
- Checks if tokens expired

### 3. Creating JWT Secret

**Generate secret key:**
```bash
# Generate random secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Add to .env file:**
```
JWT_SECRET=your-super-secret-key-here-change-this-in-production
DATABASE_URL=postgresql://...
```

**Why secret key?**
- Signs tokens (proves they're from your server)
- Must be kept secret (never commit to Git)
- Different for each environment (dev, production)

### 4. Creating a Token

**Create token after login:**
```javascript
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user and verify password (from previous lesson)
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Create JWT token
        // jwt.sign() creates a new token
        // First argument: payload (data to store in token)
        // { userId: user.id } stores user ID in token
        // Second argument: secret key (from .env)
        // Third argument: options (expiresIn sets expiration time)
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token expires in 7 days
        );
        
        // Send token to user
        // User will store this and send it with requests
        res.json({
            message: 'Login successful',
            token: token,
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

**What's in the token?**
- `userId`: User's ID (to identify user)
- `email`: User's email (optional, for convenience)
- `expiresIn`: Token expires in 7 days

**Token looks like:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTY0MjI1NjAwMCwiZXhwIjoxNjQyODU2MDAwfQ.signature
```

### 5. Verifying a Token

**Create middleware to verify tokens:**
```javascript
const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
// Middleware runs before route handler
const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    // Format: "Bearer TOKEN"
    // req.headers['authorization'] gets the header value
    const authHeader = req.headers['authorization'];
    
    // Extract token from "Bearer TOKEN"
    // authHeader.split(' ') splits string by space
    // ['Bearer', 'TOKEN'] → [1] gets the token part
    const token = authHeader && authHeader.split(' ')[1];
    
    // If no token, return 401 (unauthorized)
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    // Verify token
    // jwt.verify() checks if token is valid
    // First argument: token to verify
    // Second argument: secret key (must match the one used to sign)
    // Third argument: callback function
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // If token is invalid or expired, err will be set
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        
        // Token is valid!
        // user contains the payload data (userId, email)
        // Add user info to request object
        // Now route handlers can access req.user
        req.user = user;
        
        // Call next() to continue to route handler
        // Without this, request stops here
        next();
    });
};
```

**What happens:**
1. Client sends token in header: `Authorization: Bearer TOKEN`
2. Middleware extracts token
3. `jwt.verify()` checks signature and expiration
4. If valid, adds user info to `req.user`
5. Calls `next()` to continue to route handler

### 6. Using Protected Routes

**Protect routes with middleware:**
```javascript
// GET /tasks - Protected route
// authenticateToken runs BEFORE the route handler
// If token is invalid, request stops at middleware
app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        // req.user contains user info from token
        // req.user.userId is the user ID from token payload
        const userId = req.user.userId;
        
        // Get only tasks belonging to this user
        // WHERE user_id = $1 filters tasks by user
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY "createdAt" DESC',
            [userId]
        );
        
        // Send user's tasks
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

**What happens:**
1. Client sends request with token
2. `authenticateToken` middleware verifies token
3. If valid, adds `req.user` with user info
4. Route handler uses `req.user.userId` to get user's tasks
5. Returns only tasks belonging to that user

### 7. Complete Example

**server.js:**
```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Middleware to verify JWT token
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

// Register
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected routes
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

app.listen(3000);
```

### 8. Testing with Postman

**Register:**
```
POST http://localhost:3000/register
Body: { "email": "test@example.com", "password": "password123" }
```

**Login:**
```
POST http://localhost:3000/login
Body: { "email": "test@example.com", "password": "password123" }
Response: { "token": "eyJhbGc...", "user": {...} }
```

**Get tasks (with token):**
```
GET http://localhost:3000/tasks
Headers: Authorization: Bearer eyJhbGc...
```

### 9. Token Expiration

**Why expiration?**
- Limits damage if token is stolen
- Forces re-authentication periodically
- More secure

**Set expiration:**
```javascript
// Expires in 7 days
jwt.sign(payload, secret, { expiresIn: '7d' });

// Expires in 1 hour
jwt.sign(payload, secret, { expiresIn: '1h' });

// Expires in 30 minutes
jwt.sign(payload, secret, { expiresIn: '30m' });
```

**Handle expired tokens:**
```javascript
jwt.verify(token, secret, (err, user) => {
    if (err) {
        // err.name === 'TokenExpiredError' means token expired
        return res.status(403).json({ error: 'Token expired' });
    }
    // Token is valid
});
```

## Practice:
1. Install jsonwebtoken package
2. Add JWT_SECRET to .env
3. Create token after login
4. Create authenticateToken middleware
5. Protect /tasks route
6. Test with Postman (register → login → get tasks)

## Common Mistakes:

**Missing Bearer prefix:**
```javascript
// ❌ Bad - token not extracted correctly
const token = req.headers['authorization'];

// ✅ Good - extracts token from "Bearer TOKEN"
const token = authHeader && authHeader.split(' ')[1];
```

**Wrong secret:**
```javascript
// ❌ Bad - hardcoded secret
jwt.sign(payload, 'my-secret');

// ✅ Good - from environment variable
jwt.sign(payload, process.env.JWT_SECRET);
```

## Next Steps:
Now that authentication works, we'll connect the frontend to use these endpoints!

