# Express.js Framework

## What is Express?
Express is a fast, minimalist web framework for Node.js. It makes building servers much easier!

## Key Concepts:

### 1. Basic Express Server
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2. Routes
```javascript
const express = require('express');
const app = express();

// GET route
app.get('/', (req, res) => {
    res.send('Home Page');
});

app.get('/about', (req, res) => {
    res.send('About Page');
});

// POST route
app.post('/users', (req, res) => {
    res.send('User created');
});

// PUT route
app.put('/users/:id', (req, res) => {
    res.send(`Update user ${req.params.id}`);
});

// DELETE route
app.delete('/users/:id', (req, res) => {
    res.send(`Delete user ${req.params.id}`);
});

app.listen(3000);
```

### 3. Route Parameters
```javascript
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

app.get('/posts/:postId/comments/:commentId', (req, res) => {
    res.json({
        postId: req.params.postId,
        commentId: req.params.commentId
    });
});
```

### 4. Query Parameters
```javascript
app.get('/search', (req, res) => {
    const query = req.query.q;
    const page = req.query.page || 1;
    res.send(`Searching for: ${query}, Page: ${page}`);
});

// URL: /search?q=nodejs&page=2
```

### 5. Request Body (JSON)
```javascript
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    res.json({
        message: 'User created',
        user: { name, email }
    });
});
```

### 6. Middleware
Middleware functions run between receiving a request and sending a response.

**Custom middleware:**
```javascript
const express = require('express');
const app = express();

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date()}`);
    next(); // Continue to next middleware
});

app.get('/', (req, res) => {
    res.send('Hello!');
});
```

**Multiple middleware:**
```javascript
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form data

// Static files
app.use(express.static('public'));
```

### 7. Response Methods
```javascript
app.get('/json', (req, res) => {
    res.json({ message: 'Hello' });
});

app.get('/status', (req, res) => {
    res.status(404).send('Not Found');
});

app.get('/redirect', (req, res) => {
    res.redirect('/');
});
```

### 8. Error Handling
```javascript
app.get('/error', (req, res) => {
    throw new Error('Something went wrong!');
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
```

### 9. Router (Organizing Routes)
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('All users');
});

router.get('/:id', (req, res) => {
    res.send(`User ${req.params.id}`);
});

module.exports = router;

// app.js
const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

app.use('/users', usersRouter);
```

### 10. CORS (Cross-Origin Resource Sharing)
```bash
npm install cors
```

```javascript
const cors = require('cors');
app.use(cors());
```

## Practice:
1. Create an Express server with routes for a blog (posts, comments)
2. Build a simple REST API for a todo list
3. Add middleware to log all requests
4. Create a router for user-related routes
