# Backend Deployment

## Deploying Your Express API
Let's put your backend API online so it's accessible from anywhere.

## Key Concepts:

### 1. Deploying to Railway (Easiest)

**Step 1: Sign Up**
1. Go to railway.app
2. Sign up with GitHub (free)

**Step 2: Create Project**
1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your repository
5. Railway automatically detects Node.js

**Step 3: Set Environment Variables**
1. Click on your project
2. Go to "Variables" tab
3. Add:
   - `DATABASE_URL` - Your Supabase connection string
   - `JWT_SECRET` - Your secret key
   - `PORT` - Railway sets this automatically

**Step 4: Deploy**
1. Railway automatically deploys
2. Wait 2-3 minutes
3. Get your URL: `https://your-app.railway.app`

**Step 5: Test**
```bash
curl https://your-app.railway.app/tasks
```

### 2. Update package.json

**Add start script:**
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

**Railway runs `npm start` automatically.**

### 3. Common Issues

**"Cannot find module":**
- Make sure all packages in package.json
- Railway installs from package.json

**"Connection refused":**
- Check DATABASE_URL is set
- Verify database is accessible

**"Port already in use":**
- Use `process.env.PORT` in code
- Railway sets PORT automatically

## Practice:
1. Push code to GitHub
2. Deploy to Railway
3. Set environment variables
4. Test your API
5. Update frontend API URL

## Next:
Deploy your frontend so users can access it!

