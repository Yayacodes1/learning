# Authentication Basics

## What is Authentication?
Authentication is verifying who a user is. It's like showing your ID card - the system checks "Are you really who you say you are?"

## Why Do We Need Authentication?
- **User accounts**: People need to register and login
- **Privacy**: Users should only see their own data
- **Security**: Protect user information
- **Personalization**: Each user has their own tasks, settings, etc.

## Key Concepts:

### 1. Authentication vs Authorization

**Authentication (Who are you?):**
- Verifies user identity
- "Are you really John?"
- Login/register process

**Authorization (What can you do?):**
- Controls access to resources
- "Can John edit this task?"
- Permission checking

**Simple analogy:**
- Authentication = Showing ID at door
- Authorization = Being allowed into VIP section

### 2. How Authentication Works

**The Flow:**
```
1. User registers → Creates account with email/password
2. User logs in → Provides email/password
3. Server verifies → Checks if password is correct
4. Server gives token → JWT token proves identity
5. User sends token → With every request
6. Server verifies token → Allows access if valid
```

**Why tokens?**
- Server doesn't need to check password every time
- Token proves user is logged in
- More efficient than checking database each request

### 3. What We Need to Build

**Database Tables:**
- `users` table to store user accounts
- `tasks` table linked to users (user_id)

**API Endpoints:**
- `POST /register` - Create new user account
- `POST /login` - Login and get token
- Protected routes - Require token to access

**Security:**
- Hash passwords (never store plain passwords)
- Use JWT tokens for authentication
- Verify tokens on protected routes

### 4. Users Table Structure

**Create users table:**
```sql
-- Create users table to store user accounts
CREATE TABLE users (
    -- id is auto-incrementing unique identifier
    -- PRIMARY KEY means it's the main way to identify a user
    id SERIAL PRIMARY KEY,
    
    -- email must be unique (no duplicates)
    -- UNIQUE means each email can only be used once
    -- NOT NULL means email is required
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- password will be hashed (encrypted)
    -- NOT NULL means password is required
    -- We'll hash this, so it's safe to store
    password VARCHAR(255) NOT NULL,
    
    -- createdAt automatically sets when user registers
    "createdAt" TIMESTAMP DEFAULT NOW()
);
```

**What each column does:**
- `id` - Unique number for each user (1, 2, 3...)
- `email` - User's email address (must be unique)
- `password` - Hashed password (encrypted, not plain text)
- `createdAt` - When user registered

### 5. Linking Tasks to Users

**Add user_id to tasks table:**
```sql
-- Add user_id column to tasks table
-- This connects each task to a user
ALTER TABLE tasks 
ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
```

**What this does:**
- `user_id` stores which user owns the task
- `REFERENCES users(id)` means user_id must match a user's id
- `ON DELETE CASCADE` means if user is deleted, their tasks are deleted too

**Now tasks belong to users:**
- Each task has a `user_id`
- Users can only see/edit their own tasks
- One user can have many tasks (one-to-many relationship)

### 6. Registration Endpoint

**What registration does:**
1. User sends email and password
2. Check if email already exists
3. Hash the password (encrypt it)
4. Save user to database
5. Return success

**Basic structure:**
```javascript
app.post('/register', async (req, res) => {
    // 1. Get email and password from request body
    const { email, password } = req.body;
    
    // 2. Check if user already exists
    // (We'll implement this in next lesson)
    
    // 3. Hash password
    // (We'll implement this in next lesson)
    
    // 4. Save to database
    // (We'll implement this in next lesson)
    
    // 5. Return success
    res.status(201).json({ message: 'User created' });
});
```

### 7. Login Endpoint

**What login does:**
1. User sends email and password
2. Find user by email in database
3. Compare password with stored hash
4. If correct, create JWT token
5. Return token to user

**Basic structure:**
```javascript
app.post('/login', async (req, res) => {
    // 1. Get email and password from request body
    const { email, password } = req.body;
    
    // 2. Find user by email
    // (We'll implement this in next lesson)
    
    // 3. Compare password
    // (We'll implement this in next lesson)
    
    // 4. Create JWT token
    // (We'll implement this in next lesson)
    
    // 5. Return token
    res.json({ token: 'jwt-token-here' });
});
```

### 8. Protected Routes

**What protected routes do:**
- Require valid token to access
- Verify token before allowing access
- Add user info to request

**Basic structure:**
```javascript
// Middleware to verify token
const authenticateToken = (req, res, next) => {
    // 1. Get token from request headers
    // (We'll implement this in next lesson)
    
    // 2. Verify token is valid
    // (We'll implement this in next lesson)
    
    // 3. Add user info to request
    // (We'll implement this in next lesson)
    
    // 4. Continue to route handler
    next();
};

// Protected route - requires authentication
app.get('/tasks', authenticateToken, async (req, res) => {
    // req.user contains user info from token
    // Get only tasks belonging to this user
    const userId = req.user.userId;
    // Query database for user's tasks
});
```

### 9. The Complete Flow

**Registration:**
```
User → POST /register { email, password }
  ↓
Server → Check email exists?
  ↓ No
Server → Hash password
  ↓
Server → Save to database
  ↓
Server → Return success
```

**Login:**
```
User → POST /login { email, password }
  ↓
Server → Find user by email
  ↓ Found
Server → Compare password
  ↓ Correct
Server → Create JWT token
  ↓
Server → Return token
```

**Accessing Protected Route:**
```
User → GET /tasks + token in header
  ↓
Server → Verify token
  ↓ Valid
Server → Get user_id from token
  ↓
Server → Query database for user's tasks
  ↓
Server → Return tasks
```

### 10. Security Concepts

**Password Hashing:**
- Never store plain passwords
- Hash passwords before storing
- One-way encryption (can't reverse)

**JWT Tokens:**
- Contains user info (id, email)
- Signed by server (can't be forged)
- Expires after set time

**Token Storage:**
- Store in localStorage (frontend)
- Send in Authorization header
- Never expose in URLs

## Practice:
1. Create users table in database
2. Add user_id column to tasks table
3. Understand the authentication flow
4. Plan your registration endpoint
5. Plan your login endpoint

## Next Steps:
In the next lessons, we'll implement:
- Password hashing with bcrypt
- JWT token creation and verification
- Protected routes middleware

## Key Takeaways:
- Authentication verifies user identity
- Users need accounts (email/password)
- Tokens prove user is logged in
- Protected routes require valid tokens
- Never store plain passwords!

