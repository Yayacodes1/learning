/*## Practice:
1. Install bcrypt package
2. Create registration endpoint with password hashing
3. Create login endpoint with password comparison
4. Test registration (check database for hashed password)
5. Test login with correct password
6. Test login with wrong password
*/
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Make sure you have db.js set up

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash the password (THIS IS THE KEY PART!)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save to database
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        
        res.status(201).json({
            message: 'User created',
            user: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        
        // Compare password (THIS IS THE KEY PART!)
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});