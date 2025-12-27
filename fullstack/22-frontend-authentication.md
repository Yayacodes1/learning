# Frontend Authentication

## Connecting Frontend to Authentication
Now that your backend has authentication, your frontend needs to handle login, registration, and sending tokens with requests.

## Key Concepts:

### 1. Storing Tokens

**localStorage:**
```javascript
// Store token after login
// localStorage persists data even after browser closes
localStorage.setItem('token', 'eyJhbGc...');

// Get token when needed
const token = localStorage.getItem('token');

// Remove token on logout
localStorage.removeItem('token');
```

**What localStorage does:**
- Stores data in browser
- Persists after page refresh
- Only accessible from same domain
- Perfect for storing tokens

### 2. Login Function

**Login and store token:**
```javascript
async function login(email, password) {
    try {
        // Send login request to backend
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        // Parse response
        const data = await response.json();
        
        // If login successful, data.token exists
        if (data.token) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Return user data
            return data.user;
        } else {
            // Login failed
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}
```

### 3. Sending Token with Requests

**Include token in headers:**
```javascript
async function getTasks() {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    try {
        // Include token in Authorization header
        // Format: "Bearer TOKEN"
        const response = await fetch('http://localhost:3000/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        // If token invalid, server returns 401 or 403
        if (response.status === 401 || response.status === 403) {
            // Token expired or invalid
            localStorage.removeItem('token');
            // Redirect to login
            window.location.href = '/login.html';
            return;
        }
        
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}
```

### 4. Complete Login Page

**login.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>
    <h1>Login</h1>
    <form id="loginForm">
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
    <div id="error"></div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.token) {
                    // Store token
                    localStorage.setItem('token', data.token);
                    // Redirect to main app
                    window.location.href = '/index.html';
                } else {
                    // Show error
                    document.getElementById('error').textContent = data.error || 'Login failed';
                }
            } catch (error) {
                document.getElementById('error').textContent = 'Login failed';
            }
        });
    </script>
</body>
</html>
```

### 5. Checking if User is Logged In

**Check token on page load:**
```javascript
// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // No token, redirect to login
        window.location.href = '/login.html';
        return false;
    }
    
    return true;
}

// On page load
if (checkAuth()) {
    // User is logged in, load tasks
    loadTasks();
}
```

### 6. Logout Function

**Logout and clear token:**
```javascript
function logout() {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to login page
    window.location.href = '/login.html';
}
```

### 7. Complete App with Authentication

**index.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Todo App</title>
</head>
<body>
    <h1>My Tasks</h1>
    <button onclick="logout()">Logout</button>
    
    <form id="taskForm">
        <input type="text" id="taskTitle" placeholder="New task" required>
        <button type="submit">Add Task</button>
    </form>
    
    <div id="tasksContainer"></div>

    <script>
        const API_URL = 'http://localhost:3000/tasks';

        // Check if logged in
        function checkAuth() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login.html';
                return false;
            }
            return true;
        }

        // Get token for requests
        function getToken() {
            return localStorage.getItem('token');
        }

        // Load tasks
        async function loadTasks() {
            if (!checkAuth()) return;
            
            try {
                const response = await fetch(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                
                if (response.status === 401 || response.status === 403) {
                    logout();
                    return;
                }
                
                const tasks = await response.json();
                displayTasks(tasks);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Display tasks
        function displayTasks(tasks) {
            const container = document.getElementById('tasksContainer');
            container.innerHTML = '';
            tasks.forEach(task => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <span>${task.title}</span>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;
                container.appendChild(div);
            });
        }

        // Create task
        document.getElementById('taskForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('taskTitle').value;
            
            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ title })
                });
                document.getElementById('taskTitle').value = '';
                loadTasks();
            } catch (error) {
                console.error('Error:', error);
            }
        });

        // Delete task
        async function deleteTask(id) {
            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                loadTasks();
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Logout
        function logout() {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }

        // Load tasks on page load
        if (checkAuth()) {
            loadTasks();
        }
    </script>
</body>
</html>
```

## Practice:
1. Create login page
2. Store token after login
3. Send token with all requests
4. Check if user is logged in
5. Redirect to login if no token
6. Add logout button

## Next Steps:
Now deploy everything so it's live on the internet!

