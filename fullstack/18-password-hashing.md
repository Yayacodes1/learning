# Password Hashing

## Why Hash Passwords?
**Never store plain passwords!** If someone steals your database, they'd have everyone's passwords. Hashing encrypts passwords so they can't be reversed.

## What is Password Hashing?
Hashing converts a password into a scrambled string. It's one-way - you can't reverse it back to the original password.

**Example:**
```
Plain password: "mypassword123"
Hashed: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

**Why it's safe:**
- Can't reverse hash back to password
- Same password = different hash each time (salt)
- Takes time to crack (slow algorithm)

## Key Concepts:

### 1. Installing bcrypt

**Install package:**
```bash
# bcrypt is a library for hashing passwords
# It's the industry standard for password hashing
npm install bcrypt
```

**What bcrypt does:**
- Hashes passwords securely
- Adds salt automatically (random data)
- Slow by design (harder to crack)

### 2. Hashing a Password

**Hash password during registration:**
```javascript
const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // bcrypt.hash() hashes the password
        // password is the plain text password from user
        // 10 is the "salt rounds" (how many times to hash)
        // Higher number = more secure but slower (10 is good balance)
        // await waits for hashing to complete (it takes time)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Now hashedPassword is safe to store in database
        // It looks like: "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
        // You can't reverse this back to "mypassword123"
        
        // Save user with hashed password
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

**What happens:**
1. User sends password: "mypassword123"
2. `bcrypt.hash()` scrambles it: "$2b$10$..."
3. Store scrambled version in database
4. Original password is never stored

### 3. Comparing Passwords

**Check password during login:**
```javascript
const bcrypt = require('bcrypt');

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        // If user not found, return error
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        // user.password is the hashed password from database
        // It looks like: "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
        
        // bcrypt.compare() checks if plain password matches hash
        // password is what user typed: "mypassword123"
        // user.password is stored hash: "$2b$10$..."
        // It hashes the plain password and compares with stored hash
        const isValid = await bcrypt.compare(password, user.password);
        
        // isValid is true if passwords match, false if they don't
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Password is correct! Now create token (next lesson)
        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

**How bcrypt.compare() works:**
1. Takes plain password: "mypassword123"
2. Takes stored hash: "$2b$10$..."
3. Hashes plain password with same salt from stored hash
4. Compares the two hashes
5. Returns true if they match, false if they don't

**Why this works:**
- Can't reverse hash to get original password
- But can hash new password and compare
- Same password = same hash (with same salt)

### 4. Salt Rounds Explained

**What are salt rounds?**
- Number of times password is hashed
- Higher = more secure but slower
- 10 is recommended (good balance)

**Example:**
```javascript
// Round 10 (recommended)
const hash = await bcrypt.hash('password', 10);
// Takes ~100ms to hash

// Round 5 (too fast, less secure)
const hash = await bcrypt.hash('password', 5);
// Takes ~10ms to hash

// Round 15 (very secure but slow)
const hash = await bcrypt.hash('password', 15);
// Takes ~1000ms to hash
```

**Why 10?**
- Fast enough for users (doesn't feel slow)
- Slow enough for attackers (hard to crack)
- Industry standard

### 5. Complete Registration Example

**Full registration endpoint:**
```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;
        
        // Check if user already exists
        // Query database for user with this email
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        // If user exists, return error
        // existingUser.rows.length > 0 means email is already taken
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash the password before storing
        // This converts "mypassword123" to "$2b$10$..."
        // 10 is salt rounds (how secure)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into database with hashed password
        // Only store email and hashed password (never plain password!)
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        
        // Return user info (without password!)
        // result.rows[0] contains the new user
        res.status(201).json({
            message: 'User created',
            user: result.rows[0] // { id: 1, email: "user@example.com" }
        });
    } catch (err) {
        // If something goes wrong, send error
        res.status(500).json({ error: err.message });
    }
});
```

### 6. Complete Login Example

**Full login endpoint:**
```javascript
app.post('/login', async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;
        
        // Find user by email
        // Query database for user with matching email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        // If no user found, return error
        // Don't say "user not found" - say "invalid credentials" (security)
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Get user from database
        const user = result.rows[0];
        // user.password is the hashed password stored in database
        
        // Compare plain password with stored hash
        // bcrypt.compare() hashes the plain password and compares
        // Returns true if they match, false if they don't
        const isValid = await bcrypt.compare(password, user.password);
        
        // If password doesn't match, return error
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Password is correct! User is authenticated
        // Next step: create JWT token (in next lesson)
        res.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

### 7. Security Best Practices

**✅ DO:**
- Always hash passwords before storing
- Use bcrypt with salt rounds 10+
- Compare passwords with bcrypt.compare()
- Return generic errors ("Invalid credentials" not "User not found")

**❌ DON'T:**
- Never store plain passwords
- Never compare passwords directly (`password === storedPassword`)
- Don't tell attackers if email exists
- Don't use weak hashing (MD5, SHA1)

### 8. Testing Password Hashing

**Test registration:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "mypassword123"}'
```

**Check database:**
```sql
-- Password should be hashed, not plain text
SELECT id, email, password FROM users;
-- password column should show: $2b$10$...
```

**Test login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "mypassword123"}'
```

## Practice:
1. Install bcrypt package
2. Create registration endpoint with password hashing
3. Create login endpoint with password comparison
4. Test registration (check database for hashed password)
5. Test login with correct password
6. Test login with wrong password

## Common Mistakes:

**Forgetting await:**
```javascript
// ❌ Bad - returns Promise, not hash
const hash = bcrypt.hash(password, 10);

// ✅ Good - waits for hash
const hash = await bcrypt.hash(password, 10);
```

**Comparing wrong way:**
```javascript
// ❌ Bad - plain text comparison
if (password === user.password) { ... }

// ✅ Good - bcrypt comparison
const isValid = await bcrypt.compare(password, user.password);
```

## Next Steps:
Now that passwords are secure, we'll add JWT tokens so users can stay logged in!

