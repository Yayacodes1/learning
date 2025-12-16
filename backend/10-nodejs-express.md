# Express.js Framework

## What is Express?
Express is a fast, minimalist web framework for Node.js. It makes building servers much easier!

## Key Concepts:

### 1. Basic Express Server
```javascript
// Import the Express module
const express = require('express');
// Create an Express application instance
const app = express();
// Set the port number for the server
const PORT = 3000;

// Define a GET route handler for the root path '/'
// When someone visits localhost:3000, this sends "Hello, World!" to the browser
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server and listen on port 3000
// This is what actually opens/starts the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2. Routes
```javascript
// Import Express and create the app
const express = require('express');
const app = express();

// GET route - can be accessed by typing URL in browser
// Route 1: Root path - sends "Home Page" when visiting localhost:3000
app.get('/', (req, res) => {
    res.send('Home Page');
});

// Route 2: About path - sends "About Page" when visiting localhost:3000/about
app.get('/about', (req, res) => {
    res.send('About Page');
});

// POST route - cannot be accessed by typing in browser, need Postman or programmatic request
// Creates a new user - sends "User created" when POST request is made to /users
app.post('/users', (req, res) => {
    res.send('User created');
});

// PUT route - means UPDATE, not retrieve (use Postman to test)
// :id is a route parameter that captures the user ID from the URL
// Example: PUT /users/123 captures 123 in req.params.id and sends "Update user 123"
app.put('/users/:id', (req, res) => {
    res.send(`Update user ${req.params.id}`);
});

// DELETE route - deletes a user by ID (use Postman to test)
// Example: DELETE /users/123 sends "Delete user 123"
app.delete('/users/:id', (req, res) => {
    res.send(`Delete user ${req.params.id}`);
});

// Start the server on port 3000
app.listen(3000);
```

### 3. Route Parameters
```javascript
// Route parameter example 1: Single parameter
// When visiting localhost:3000/users/5, the :id captures "5" from the URL
app.get('/users/:id', (req, res) => {
    // Extract the id value from the URL and store it in userId
    // Example: /users/5 → userId = "5"
    const userId = req.params.id;
    // Send "User ID: 5" to the browser
    res.send(`User ID: ${userId}`);
});

// Route parameter example 2: Multiple parameters
// When visiting localhost:3000/posts/3/comments/2, both :postId and :commentId are captured
app.get('/posts/:postId/comments/:commentId', (req, res) => {
    // Send JSON response with both extracted values
    // Example: /posts/3/comments/2 → { "postId": "3", "commentId": "2" }
    res.json({
        postId: req.params.postId,      // Gets "3" from the URL
        commentId: req.params.commentId  // Gets "2" from the URL
    });
});
```

### 4. Query Parameters
```javascript
// GET route for search endpoint
// When visiting localhost:3000/search?q=nodejs&page=2
app.get('/search', (req, res) => {
    // Extract the 'q' query parameter from the URL
    // Example: /search?q=nodejs → query = "nodejs"
    const query = req.query.q;
    
    // Extract the 'page' query parameter, or default to 1 if not provided
    // Example: /search?page=2 → page = "2"
    // If no page parameter: /search?q=nodejs → page = 1 (default)
    const page = req.query.page || 1;
    
    // Send response to browser showing the search query and page number
    // Example: "Searching for: nodejs, Page: 2"
    res.send(`Searching for: ${query}, Page: ${page}`);
});

// URL: /search?q=nodejs&page=2
```

### 5. Request Body (JSON)
```javascript
// Import Express module
const express = require('express');
// Create Express application instance
const app = express();

// Middleware: Parse incoming JSON request bodies
// This allows us to read JSON data sent in POST requests
// Without this, req.body would be undefined or a string
app.use(express.json());

// POST route handler for /users endpoint
// Note: This is NOT the root URL - root is '/', this is '/users'
// Cannot be accessed by typing in browser - use Postman or programmatic request
app.post('/users', (req, res) => {
    // Destructure: Extract 'name' and 'email' from req.body object
    // Example: If req.body = { name: "John", email: "john@example.com" }
    // Then: name = "John", email = "john@example.com"
    const { name, email } = req.body;
    
    // Send JSON response back to client
    // This will be received by Postman or whatever made the POST request
    res.json({
        message: 'User created',
        user: { name, email }  // Shorthand for { name: name, email: email }
    });
});
```

### 6. Middleware
Middleware functions run between receiving a request and sending a response.

**Custom middleware:**
```javascript
// Import Express module
const express = require('express');
// Create Express application instance
const app = express();

// Logger middleware - runs for every request before route handlers
// This is an anonymous function that logs request details
app.use((req, res, next) => {
    // Log the HTTP method (GET, POST, etc.), URL path, and current date/time
    // Example output: "GET / - Mon Jan 15 2024 10:30:45"
    console.log(`${req.method} ${req.url} - ${new Date()}`);
    
    // Call next() to pass control to the next middleware or route handler
    // Without this, the request would hang and never reach the route handler
    next(); // Continue to next middleware
});

// GET route handler for root path
// After middleware runs, this handler executes
// When visiting localhost:3000/, sends "Hello!" to the browser
app.get('/', (req, res) => {
    res.send('Hello!');
});
```

**Multiple middleware:**
```javascript
/// Middleware 1: Parse incoming JSON request bodies
// This allows us to read JSON data sent in POST/PUT requests
// Without this, req.body would be undefined when receiving JSON data
// Example: If client sends { "name": "John" }, this makes req.body = { name: "John" }
app.use(express.json());
// Example usage in a route:
// POST /users with body: { "name": "John", "email": "john@example.com" }
// Without this middleware: req.body = undefined
// With this middleware: req.body = { name: "John", email: "john@example.com" }

// Middleware 2: Parse URL-encoded form data (from HTML forms)
// This handles data sent from HTML forms with method="POST"
// Converts form data like "name=John&email=john@example.com" into req.body object
// extended: true allows parsing of nested objects
app.use(express.urlencoded({ extended: true }));
// Example usage:
// HTML form: <form method="POST" action="/users">
//              <input name="name" value="John">
//              <input name="email" value="john@example.com">
//            </form>
// Without this middleware: req.body = undefined
// With this middleware: req.body = { name: "John", email: "john@example.com" }

// Middleware 3: Serve static files from the 'public' folder
// This makes files in the 'public' folder accessible via URL
// Example: public/style.css becomes accessible at http://localhost:3000/style.css
// Example: public/images/logo.png becomes accessible at http://localhost:3000/images/logo.png
app.use(express.static('public'));
// Example file structure:
// project/
//   ├── server.js
//   └── public/
//       ├── index.html      → accessible at http://localhost:3000/index.html
//       ├── style.css       → accessible at http://localhost:3000/style.css
//       └── images/
//           └── logo.png    → accessible at http://localhost:3000/images/logo.png
```

### 7. Response Methods
```javascript
// Route handler for /json endpoint
// When user visits /json, sends a JSON response with a message
app.get('/json', (req, res) => {
    res.json({ message: 'Hello' });
});

// Route handler for /status endpoint
// When user visits /status, returns a 404 status code with "Not Found" message
app.get('/status', (req, res) => {
    res.status(404).send('Not Found');
});

// Route handler for /redirect endpoint
// When user visits /redirect, redirects them back to the root URL (/)
app.get('/redirect', (req, res) => {
    res.redirect('/');
});
```

### 8. Error Handling
```javascript
// Route handler for /error endpoint
// When user visits /error, this throws an error to demonstrate error handling
app.get('/error', (req, res) => {
    throw new Error('Something went wrong!');
});

// Error handling middleware (must be last)
// This middleware catches any errors thrown in route handlers
// It has 4 parameters: err (error object), req (request), res (response), next (next middleware)
app.use((err, req, res, next) => {
    // Log the full error stack trace to the server console for debugging
    console.error(err.stack);
    // Send a 500 Internal Server Error status with a message to the browser
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
