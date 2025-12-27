# SQL Basics

## What is SQL?
SQL (Structured Query Language) is the language used to talk to databases. It's like asking questions and giving commands to your database.

## Why Learn SQL?
- **Universal language**: Works with PostgreSQL, MySQL, SQL Server, etc.
- **Industry standard**: Every developer needs to know SQL
- **Powerful**: Can find, organize, and manipulate data efficiently
- **Foundation**: Everything else builds on SQL knowledge

## Key Concepts:

### 1. What is a Database?
A database is like a digital filing cabinet. Instead of files, it stores data in **tables**.

**Think of it like this:**
- **Database** = Filing cabinet
- **Table** = Drawer (tasks, users, products)
- **Row** = One file/document (one task, one user)
- **Column** = Category (id, title, completed)

### 2. SELECT - Reading Data

**SELECT gets data from tables:**

```sql
-- SELECT * means "get all columns"
-- FROM tasks means "from the tasks table"
-- This gets EVERYTHING from the tasks table
SELECT * FROM tasks;
```

**Get specific columns:**
```sql
-- Instead of *, we list the columns we want
-- This only gets id and title columns, not description or completed
SELECT id, title FROM tasks;
```

**Get data with conditions:**
```sql
-- WHERE is like saying "but only if..."
-- This gets tasks WHERE completed equals false
-- Only returns tasks that are not completed
SELECT * FROM tasks WHERE completed = false;
```

**Order the results:**
```sql 
-- ORDER BY sorts the results
-- createdAt is the column to sort by
-- DESC means descending (newest first)
-- ASC would be ascending (oldest first)
SELECT * FROM tasks ORDER BY createdAt DESC;
```

**Combine conditions:**
```sql
-- AND means both conditions must be true
-- This gets tasks that are NOT completed AND created today
SELECT * FROM tasks 
WHERE completed = false 
AND "createdAt" > '2024-01-01';
```

### 3. INSERT - Adding Data

**INSERT adds new rows to a table:**

```sql
-- INSERT INTO tells which table to add to
-- (title, completed) lists the columns we're filling
-- VALUES tells what data to put in those columns
-- This creates ONE new task
INSERT INTO tasks (title, completed) 
VALUES ('Learn PostgreSQL', false);
```

**Insert multiple rows at once:**
```sql
-- You can add multiple rows by separating with commas
-- Each set of VALUES is one new row
INSERT INTO tasks (title, completed) 
VALUES 
  ('Task 1', false),    -- First new task
  ('Task 2', true),     -- Second new task
  ('Task 3', false);    -- Third new task
```

**What happens:**
- Database creates a new row
- Fills in the columns you specified
- Auto-generates id (if it's SERIAL)
- Sets default values for columns you didn't specify

### 4. UPDATE - Modifying Data

**UPDATE changes existing data:**

```sql
-- UPDATE tells which table to modify
-- SET tells what to change (completed = true)
-- WHERE tells which rows to change (only id = 1)
-- Without WHERE, it would update ALL rows (dangerous!)
UPDATE tasks 
SET completed = true 
WHERE id = 1;
```

**Update multiple columns:**
```sql
-- You can update multiple columns at once
-- Separate them with commas
-- This changes both title AND completed for task with id = 1
UPDATE tasks 
SET title = 'Updated title', completed = true 
WHERE id = 1;
```

**Important:** Always use WHERE! Without it, you'll update every row in the table.

### 5. DELETE - Removing Data

**DELETE removes rows from a table:**

```sql
-- DELETE FROM tells which table
-- WHERE tells which rows to delete (only id = 1)
-- Without WHERE, it deletes EVERYTHING (very dangerous!)
DELETE FROM tasks WHERE id = 1;
```

**Delete multiple rows:**
```sql
-- This deletes ALL completed tasks
-- WHERE completed = true finds all completed tasks
-- Then DELETE removes them
DELETE FROM tasks WHERE completed = true;
```

**Warning:** DELETE is permanent! Once deleted, data is gone (unless you have backups).

### 6. Creating Tables

**Tables need to be created before you can use them:**

```sql
-- CREATE TABLE creates a new table
-- tasks is the table name
-- Inside parentheses are the columns (fields)
CREATE TABLE tasks (
    -- id column: SERIAL  means auto-incrementing number (1, 2, 3...)
    -- PRIMARY KEY means it's the unique identifier (like a social security number)
    id SERIAL PRIMARY KEY,
    
    -- title column: VARCHAR(255) means text up to 255 characters
    -- NOT NULL means this field is required (can't be empty)
    title VARCHAR(255) NOT NULL,
    
    -- description column: TEXT means unlimited text
    -- No NOT NULL, so description is optional
    description TEXT,
    
    -- completed column: BOOLEAN means true/false
    -- DEFAULT FALSE means if not specified, it's false
    completed BOOLEAN DEFAULT FALSE,
    
    -- createdAt column: TIMESTAMP stores date and time
    -- DEFAULT NOW() means it automatically sets to current time when created
    "createdAt" TIMESTAMP DEFAULT NOW(),
    
    -- updatedAt column: Same as createdAt
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

**Data Types Explained:**
- `SERIAL` - Auto-incrementing number (1, 2, 3, 4...)
- `VARCHAR(n)` - Text with maximum length (VARCHAR(255) = up to 255 characters)
- `TEXT` - Unlimited text (for long descriptions)
- `BOOLEAN` - True or false
- `INTEGER` - Whole numbers (1, 2, 100, -5)
- `TIMESTAMP` - Date and time (2024-01-15 10:30:45)

**Constraints Explained:**
- `PRIMARY KEY` - Unique identifier (like an ID card number)
- `NOT NULL` - Field is required (can't be empty)
- `UNIQUE` - No duplicates allowed (like email addresses)
- `DEFAULT` - Value if not specified

### 7. Relationships Between Tables

**Tables can be connected:**

```sql
-- First, create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Then add user_id to tasks table
-- This connects tasks to users
ALTER TABLE tasks 
ADD COLUMN user_id INTEGER REFERENCES users(id);
```

**What this does:**
- `user_id` column stores which user owns the task
- `REFERENCES users(id)` means user_id must match an id in users table
- This creates a relationship: tasks belong to users

**One-to-Many Relationship:**
- One user can have many tasks
- Each task belongs to one user
- Like: One person can have many books, but each book belongs to one person

### 8. JOIN - Combining Tables

**JOIN gets data from multiple tables:**

```sql
-- This gets tasks AND the user's email who owns each task
-- JOIN connects tasks table to users table
-- ON tells how to connect them (tasks.user_id = users.id)
SELECT tasks.*, users.email 
FROM tasks 
JOIN users ON tasks.user_id = users.id;
```

**What happens:**
- Gets all columns from tasks (`tasks.*`)
- Also gets email from users (`users.email`)
- Only shows tasks that have a matching user

**Get tasks for specific user:**
```sql
-- WHERE filters to only user with id = 1
-- This shows only tasks belonging to that user
SELECT tasks.* 
FROM tasks 
JOIN users ON tasks.user_id = users.id 
WHERE users.id = 1;
```

## Practice:
1. Write a SELECT query to get all completed tasks

SELECT * FROM TASKS WHERE completed = true;

2. Write an INSERT to add a new task

INSERT INTO TASKS (title, completed)
VALUES ('Learn SQL', false);

3. Write an UPDATE to mark a task as completed

4. Write a DELETE to remove a specific task
5. Create a users table
CREATE TABLE USERS(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
)
6. Add user_id to tasks table
ALTER TABLE  TASKS 
ADD COLUMN user_id INTEGER REFERENCES users(id)
7. Write a JOIN query to get tasks with user emails
SELECT  TASKS.*, users.email
FROM TASKS
JOIN USERS ON USERS.ID = TASKS.USER_ID
## Common Mistakes:

**Forgetting WHERE clause:**
```sql
-- ❌ Bad - Updates EVERY task!
UPDATE tasks SET completed = true;

-- ✅ Good - Updates only one task
UPDATE tasks SET completed = true WHERE id = 1;
```

**Wrong data types:**
```sql
-- ❌ Bad - Can't put text in INTEGER column
INSERT INTO tasks (id, title) VALUES ('abc', 'Task');

-- ✅ Good - id is auto-generated, don't specify it
INSERT INTO tasks (title) VALUES ('Task');
```

## Resources:
- SQLBolt: https://sqlbolt.com (Interactive SQL tutorial)
- Practice SQL online: https://www.w3schools.com/sql/

