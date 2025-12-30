# Fetch API - Connecting Frontend to Backend

## What is Fetch?
Fetch is a built-in JavaScript function that lets your frontend talk to your backend API. It's like making a phone call from your HTML page to your Express server.

## Why Fetch?
- **Built-in**: No installation needed (works in browsers)
- **Simple**: Easy to use for API calls
- **Modern**: Replaces old XMLHttpRequest
- **Standard**: Used everywhere in modern web apps

## Key Concepts:

### 1. Basic Fetch Request

**GET request (read data):**
```javascript
// fetch() sends HTTP request to the URL
// 'http://localhost:3000/tasks' is your backend API endpoint
// fetch() returns a Promise (asynchronous operation)
fetch('http://localhost:3000/tasks')
    // .then() waits for response to arrive
    // response is the HTTP response object
    .then(response => {
        // response.json() converts JSON response to JavaScript object
        // This also returns a Promise
        return response.json();
    })
    // .then() waits for JSON parsing to complete
    // data is the actual tasks array
    .then(data => {
        // Now you have the tasks array
        console.log(data); // Array of tasks
    })
    // .catch() handles any errors
    .catch(error => {
        console.error('Error:', error);
    });
```

**What happens step by step:**
1. `fetch()` sends GET request to API
2. Backend processes request and sends response
3. `response.json()` converts JSON to JavaScript object
4. `.then()` receives the data
5. You can use the data (display it, etc.)

### 2. Using async/await (Cleaner Syntax)

**Same request with async/await:**
```javascript
// async function allows using await
async function getTasks() {
    try {
        // await waits for fetch to complete
        // response contains HTTP response
        const response = await fetch('http://localhost:3000/tasks');
        
        // await waits for JSON parsing
        // tasks is the array of task objects
        const tasks = await response.json();
        
        // Now use the tasks
        console.log(tasks);
        return tasks;
    } catch (error) {
        // Handle errors
        console.error('Error fetching tasks:', error);
    }
}

// Call the function
getTasks();
```

**Why async/await?**
- Cleaner than `.then()` chains
- Easier to read
- Better error handling with try/catch

### 3. POST Request (Create Data)

**Create a task:**
```javascript
async function createTask(title, description) {
    try {
        // fetch() with options object
        // method: 'POST' tells server this is a POST request
        // headers tell server what type of data we're sending
        // body contains the data to send
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        });
        
        // Parse response JSON
        const newTask = await response.json();
        
        // Return the created task
        return newTask;
    } catch (error) {
        console.error('Error creating task:', error);
    }
}
```

**What each option does:**
- `method: 'POST'` - HTTP method (GET, POST, PUT, DELETE)
- `headers` - Extra info about the request
- `'Content-Type': 'application/json'` - Tells server we're sending JSON
- `body` - The actual data to send
- `JSON.stringify()` - Converts JavaScript object to JSON string

### 4. PUT Request (Update Data)

**Update a task:**
```javascript
async function updateTask(id, updates) {
    try {
        // PUT request to update task
        // ${id} inserts the task ID into URL
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        
        const updatedTask = await response.json();
        return updatedTask;
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Usage: Update task with id 1
updateTask(1, { title: 'Updated title', completed: true });
```

### 5. DELETE Request (Remove Data)

**Delete a task:**
```javascript
async function deleteTask(id) {
    try {
        // DELETE request doesn't need body
        // Just the method and URL
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}
```

### 6. Displaying Data in HTML

**Load and display tasks:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Todo App</title>
</head>
<body>
    <h1>My Tasks</h1>
    <ul id="tasksList"></ul>

    <script>
        // Function to load tasks from API
        async function loadTasks() {
            try {
                // Fetch tasks from backend
                const response = await fetch('http://localhost:3000/tasks');
                const tasks = await response.json();
                
                // Get the <ul> element
                const tasksList = document.getElementById('tasksList');
                
                // Clear existing list items
                tasksList.innerHTML = '';
                
                // Loop through tasks and create list items
                tasks.forEach(task => {
                    // Create <li> element
                    const li = document.createElement('li');
                    
                    // Set text content
                    // task.title is the title from database
                    // task.completed ? 'Done' : 'Pending' shows status
                    li.textContent = `${task.title} - ${task.completed ? 'Done' : 'Pending'}`;
                    
                    // Add <li> to <ul>
                    tasksList.appendChild(li);
                });
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        }

        // Load tasks when page loads
        loadTasks();
    </script>
</body>
</html>
```

**What happens:**
1. Page loads
2. `loadTasks()` function runs
3. Fetches tasks from API
4. Creates `<li>` elements for each task
5. Adds them to the page

### 7. Creating Tasks from Form

**Form to create tasks:**
```html
<form id="taskForm">
    <input type="text" id="taskTitle" placeholder="Task title" required>
    <textarea id="taskDescription" placeholder="Description"></textarea>
    <button type="submit">Add Task</button>
</form>

<script>
    // Listen for form submission
    document.getElementById('taskForm').addEventListener('submit', async (e) => {
        //  Prevent default form submission (page reload)
        e.preventDefault();
        
        // Get values from form inputs
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        
        try {
            // Send POST request to create task
            await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            });
            
            // Clear form inputs
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            
            // Reload tasks to show new  one
            loadTasks();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    });
</script>
```

### 8. Error Handling

**Check response status:**
```javascript
async function getTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        
        // Check if response is OK (status 200-299)
        // If not OK, something went wrong
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error:', error);
        // Show error to user
        alert('Failed to load tasks. Please try again.');
    }
}
```

**Handle different status codes:**
```javascript
async function getTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        
        if (response.status === 404) {
            // Not found
            console.log('Tasks not found');
            return [];
        } else if (response.status === 500) {
            // Server error
            throw new Error('Server error');
        } else if (!response.ok) {
            // Other error
            throw new Error(`Error: ${response.status}`);
        }
        
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### 9. Complete Example

**index.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Todo App</title>
    <style>
        body { font-family: Arial; max-width: 600px; margin: 50px auto; }
        .task { padding: 10px; margin: 5px 0; background: #f0f0f0; }
        .completed { text-decoration: line-through; opacity: 0.6; }
    </style>
</head>
<body>
    <h1>My Todo App</h1>
    
    <form id="taskForm">
        <input type="text" id="taskTitle" placeholder="New task" required>
        <button type="submit">Add Task</button>
    </form>
    
    <div id="tasksContainer"></div>

    <script>
        const API_URL = 'http://localhost:3000/tasks';

        // Load all tasks
        async function loadTasks() {
            try {
                const response = await fetch(API_URL);
                const tasks = await response.json();
                displayTasks(tasks);
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        }

        // Display tasks on page
        function displayTasks(tasks) {
            const container = document.getElementById('tasksContainer');
            container.innerHTML = '';
            
            tasks.forEach(task => {
                const div = document.createElement('div');
                div.className = `task ${task.completed ? 'completed' : ''}`;
                div.innerHTML = `
                    <span>${task.title}</span>
                    <button onclick="toggleTask(${task.id})">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
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
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title })
                });
                document.getElementById('taskTitle').value = '';
                loadTasks();
            } catch (error) {
                console.error('Error creating task:', error);
            }
        });

        // Toggle completion
        async function toggleTask(id) {
            try {
                const response = await fetch(`${API_URL}/${id}`);
                const task = await response.json();
                
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: !task.completed })
                });
                loadTasks();
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }

        // Delete task
        async function deleteTask(id) {
            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                });
                loadTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }

        // Load tasks on page load
        loadTasks();
    </script>
</body>
</html>
```

## Practice:
1. Create HTML page with task list
2. Use fetch to load tasks from API
3. Display tasks on page
4. Add form to create new tasks
5. Add buttons to update/delete tasks
6. Handle errors gracefully

## Common Mistakes:

**Forgetting await:**
```javascript
// ❌ Bad - returns Promise, not data
const tasks = fetch(API_URL).then(r => r.json());

// ✅ Good - waits for data
const tasks = await fetch(API_URL).then(r => r.json());
```

**Wrong Content-Type:**
```javascript
// ❌ Bad - server won't parse JSON
body: JSON.stringify({ title: 'Task' })

// ✅ Good - includes Content-Type header
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ title: 'Task' })
```

## Next Steps:
Now we'll add authentication so users can login and see only their tasks!

