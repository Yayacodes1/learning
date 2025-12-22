# Node.js Final Challenge

## Build a REST API for a Task Manager

Create a complete backend API for managing tasks (like a todo app backend).

## Requirements:

### 1. Setup
- Create a new project folder
- Initialize with `npm init`
- Install Express
- Create `server.js` as your main file

### 2. Features to Implement

**Basic Server:**
- Express server running on port 3000
- JSON middleware enabled
- CORS enabled (if needed)

**Task Model:**
Each task should have:
- `id` (unique identifier)
- `title` (string, required)
- `description` (string, optional)
- `completed` (boolean, default: false)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**API Endpoints:**

1. **GET /tasks**
   - Returns all tasks
   - Optional query: `?completed=true` or `?completed=false` to filter

2. **GET /tasks/:id**
   - Returns a single task by ID
   - Returns 404 if not found

3. **POST /tasks**
   - Creates a new task
   - Requires `title` in request body
   - Returns the created task

4. **PUT /tasks/:id**
   - Updates a task by ID
   - Returns 404 if not found
   - Returns updated task

5. **PATCH /tasks/:id**
   - Partially updates a task (e.g., just toggle completed status)
   - Returns 404 if not found

6. **DELETE /tasks/:id**
   - Deletes a task by ID
   - Returns 404 if not found
   - Returns success message

### 3. Data Storage
For this challenge, you can use:
- **Option A**: In-memory array (simplest, data resets on restart)
- **Option B**: JSON file (persists data)
- **Option C**: SQLite database (more realistic)

### 4. Error Handling
- Return appropriate HTTP status codes
- Return error messages in JSON format
- Handle missing IDs, invalid data, etc.

### 5. Bonus Features
- Add pagination to GET /tasks (limit, offset)
- Add search functionality (search by title)
- Add validation (ensure title is not empty)
- Add request logging middleware
- Add rate limiting

## Example API Usage:

```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get completed tasks
curl http://localhost:3000/tasks?completed=true

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js", "description": "Complete the course"}'

# Get a specific task
curl http://localhost:3000/tasks/1

# Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js", "completed": true}'

# Toggle completion
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/1
```

## Tips:
1. Start with in-memory storage to get the API working
2. Test each endpoint as you build it
3. Use async/await for cleaner code
4. Add console.logs to debug
5. Use Postman or Thunder Client to test your API

## Success Criteria:
- ✅ All endpoints work correctly
- ✅ Proper error handling
- ✅ Clean, readable code
- ✅ Uses Express best practices
- ✅ Handles edge cases (missing data, invalid IDs, etc.)

Good luck!  🚀
 