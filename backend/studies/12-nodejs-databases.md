# Node.js and Databases

## Working with Databases
Most applications need to store data. Here's how to work with databases in Node.js.

## Key Concepts:

### 1. SQL Databases (PostgreSQL, MySQL)

**Using `pg` (PostgreSQL):**
```bash
npm install pg
```

```javascript
const { Pool } = require('pg');

const pool = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// Query
pool.query('SELECT * FROM users', (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(result.rows);
});

// With async/await
async function getUsers() {
    try {
        const result = await pool.query('SELECT * FROM users');
        return result.rows;
    } catch (err) {
        console.error(err);
    }
}
```

**Using `mysql2` (MySQL):**
```bash
npm install mysql2
```

```javascript
const mysql = require('mysql2/promise');

async function connect() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'mydb'
    });
    
    const [rows] = await connection.execute('SELECT * FROM users');
    console.log(rows);
}
```

### 2. NoSQL Databases (MongoDB)

**Using `mongodb` driver:**
```bash
npm install mongodb
```

```javascript
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connect() {
    try {
        await client.connect();
        const db = client.db('mydb');
        const collection = db.collection('users');
        
        // Insert
        await collection.insertOne({ name: 'John', age: 30 });
        
        // Find
        const users = await collection.find({}).toArray();
        console.log(users);
        
        // Update
        await collection.updateOne(
            { name: 'John' },
            { $set: { age: 31 } }
        );
        
        // Delete
        await collection.deleteOne({ name: 'John' });
    } finally {
        await client.close();
    }
}
```

**Using Mongoose (ODM for MongoDB):**
```bash
npm install mongoose
```

```javascript
const mongoose = require('mongoose');

// Connect
mongoose.connect('mongodb://localhost:27017/mydb');

// Define schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

// Create model
const User = mongoose.model('User', userSchema);

// Create
const user = new User({ name: 'John', email: 'john@example.com' });
await user.save();

// Find
const users = await User.find();
const user = await User.findById(id);

// Update
await User.updateOne({ _id: id }, { name: 'Jane' });

// Delete
await User.deleteOne({ _id: id });
```

### 3. SQLite (File-based SQL)
```bash
npm install better-sqlite3
```

```javascript
const Database = require('better-sqlite3');
const db = new Database('mydb.db');

// Create table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
    )
`);

// Insert
const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
stmt.run('John', 'john@example.com');

// Query
const users = db.prepare('SELECT * FROM users').all();
console.log(users);
```

### 4. Express with Database

**Example REST API:**
```javascript
const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const pool = new Pool({
    // connection config
});

// GET all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create user
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000);
```

### 5. Environment Variables
Never hardcode database credentials! Use environment variables.

```bash
npm install dotenv
```

**Create `.env` file:**
```
DB_HOST=localhost
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydb
```

**In your code:**
```javascript
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
```

## Practice:
1. Set up a SQLite database and create a simple CRUD API
2. Connect to MongoDB and create a user management system
3. Build a REST API with Express and PostgreSQL
4. Use environment variables for database configuration
