# PostgreSQL Setup

## What is PostgreSQL?
PostgreSQL is a powerful, free, open-source database. It's like a super-smart filing cabinet that can handle millions of files and find them instantly.

## Why PostgreSQL?
- **Industry standard**: Used by startups, big companies, and everyone in between
- **Free**: Completely free, even for commercial use
- **Powerful**: Handles complex queries and relationships
- **Reliable**: Used by companies like Instagram, Spotify, Apple
- **SQL knowledge**: Once you learn PostgreSQL, you can use MySQL, SQL Server easily

## Key Concepts:

### 1. Two Ways to Use PostgreSQL

**Option A: Cloud Database (Easiest - Recommended)**
- Use Supabase, Railway, or Neon
- No installation needed
- Free tier available
- Access from anywhere

**Option B: Local Database**
- Install on your computer
- More control
- Requires installation
- Only works on your machine

### 2. Setting Up Supabase (Cloud - Recommended)

**Step 1: Create Account**
1. Go to supabase.com
2. Click "Sign Up" (free)
3. Sign up with GitHub or email

**Step 2: Create Project**
1. Click "New Project"
2. Name your project (e.g., "todo-app")
3. Choose a database password (save this!)
4. Select region closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for setup

**Step 3: Get Connection String**
1. Go to Settings (gear icon) → Database
2. Scroll to "Connection string"
3. Copy the "URI" connection string
4. It looks like: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`

**Step 4: Use in Your App**
- Save this connection string
- You'll use it in your `.env` file
- Never share it publicly!

### 3. Setting Up Local PostgreSQL (Optional)

**For Mac:**
```bash
# Install PostgreSQL using Homebrew
# Homebrew is a package manager for Mac
brew install postgresql

# Start PostgreSQL service
# This makes PostgreSQL run in the background
brew services start postgresql

# Create a database
# mydb is the name of your database (you can name it anything)
createdb mydb

# Connect to your database
# This opens a command-line interface to talk to PostgreSQL
psql mydb
```

**What each command does:**
- `brew install postgresql` - Downloads and installs PostgreSQL
- `brew services start postgresql` - Starts the database server
- `createdb mydb` - Creates a new empty database called "mydb"
- `psql mydb` - Opens PostgreSQL command line for that database

**For Windows:**
1. Go to postgresql.org/download/windows
2. Download the installer
3. Run installer (use default settings)
4. Remember the password you set!
5. Open "SQL Shell" from Start menu
6. Connect to default database

**For Linux:**
```bash
# Install PostgreSQL
sudo apt-get install postgresql

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb mydb
```

### 4. Creating Your First Table

**In Supabase:**
1. Go to your project
2. Click "SQL Editor" in left sidebar
3. Click "New query"
4. Paste this SQL:

```sql
-- Create tasks table
-- This creates a table to store tasks
CREATE TABLE tasks (
    -- id is auto-incrementing (1, 2, 3...)
    -- PRIMARY KEY means it's the unique identifier
    id SERIAL PRIMARY KEY,
    
    -- title is required text (up to 255 characters)
    title VARCHAR(255) NOT NULL,
    
    -- description is optional unlimited text
    description TEXT,
    
    -- completed defaults to false if not specified
    completed BOOLEAN DEFAULT FALSE,
    
    -- createdAt automatically sets to current time
    "createdAt" TIMESTAMP DEFAULT NOW(),
    
    -- updatedAt automatically sets to current time
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

**In Local PostgreSQL (psql):**
```sql
-- Connect to your database first
psql mydb

-- Then run the CREATE TABLE command
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Type \dt to see all tables
\dt

-- Type \q to quit
\q
```

### 5. Testing Your Database

**Insert some test data:**
```sql
-- Add a task to test
-- This inserts one row into the tasks table
INSERT INTO tasks (title, description) 
VALUES ('Learn PostgreSQL', 'Complete the SQL basics tutorial');
```

**Query the data:**
```sql
-- Get all tasks
-- SELECT * means get all columns
-- FROM tasks means from the tasks table
SELECT * FROM tasks;
```

**You should see:**
```
id | title            | description                    | completed | createdAt           | updatedAt
---|------------------|--------------------------------|-----------|---------------------|-------------------
1  | Learn PostgreSQL | Complete the SQL basics...     | false     | 2024-01-15 10:30:00 | 2024-01-15 10:30:00
```

### 6. Understanding Connection Strings

**Connection string format:**
```
postgresql://username:password@host:port/database
```

**Breaking it down:**
- `postgresql://` - Protocol (how to connect)
- `username` - Your database username (usually "postgres")
- `password` - Your database password
- `@host` - Where database is located (localhost or cloud URL)
- `:port` - Port number (usually 5432 for PostgreSQL)
- `/database` - Which database to connect to

**Example:**
```
postgresql://postgres:mypassword123@db.abc123.supabase.co:5432/postgres
```

**What this means:**
- Username: postgres
- Password: mypassword123
- Host: db.abc123.supabase.co (Supabase server)
- Port: 5432 (default PostgreSQL port)
- Database: postgres (default database name)

### 7. Security Best Practices

**Never commit connection strings to Git!**

**Create `.env` file:**
```
# .env file (keep this secret!)
DATABASE_URL=postgresql://postgres:password@host:5432/db
```

**Add to `.gitignore`:**
```
# .gitignore file
node_modules/
.env
*.log
```

**Why?**
- `.env` contains secrets (passwords, API keys)
- If you commit it, anyone can see your database password
- `.gitignore` tells Git to ignore these files

### 8. Common Setup Issues

**"Connection refused" error:**
- Database server not running
- Check if PostgreSQL is started: `brew services list` (Mac)
- Wrong host/port in connection string

**"Authentication failed" error:**
- Wrong password
- Check your connection string
- Reset password in Supabase settings

**"Database does not exist" error:**
- Database name wrong in connection string
- Create the database first: `createdb mydb`

**"Table does not exist" error:**
- Table not created yet
- Run CREATE TABLE command first

## Practice:
1. Sign up for Supabase (or install local PostgreSQL)
2. Create a new project/database
3. Get your connection string
4. Create tasks table using SQL
5. Insert 3 test tasks
6. Query to see your tasks
7. Create `.env` file with connection string
8. Add `.env` to `.gitignore`

## Next Steps:
Once setup is complete, you'll connect PostgreSQL to your Node.js app in the next lesson!

## Resources:
- Supabase: https://supabase.com (Free PostgreSQL hosting)
- PostgreSQL Downloads: https://www.postgresql.org/download/
- Railway: https://railway.app (Alternative cloud database)

