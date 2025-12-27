# Deployment Basics

## What is Deployment?
Deployment means putting your app on the internet so others can use it. Instead of `localhost:3000`, it's live at a real URL like `https://myapp.railway.app`.

## Why Deploy?
- **Show your work**: Employers can see live projects
- **Real-world testing**: Test in production environment
- **Portfolio**: Live projects impress employers
- **Learning**: Understand production deployment

## What Needs to be Deployed?

**Three Parts:**
1. **Backend (API)** - Your Express server
2. **Database** - PostgreSQL database
3. **Frontend** - HTML/CSS/JavaScript files

## Key Concepts:

### 1. Environment Variables

**What are they?**
- Configuration values (database URLs, secrets)
- Different for dev vs production
- Never commit to Git

**Example .env:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3000
```

**In production:**
- Set in hosting platform (Railway, Heroku)
- Not in code files
- Secure and private

### 2. Update Code for Production

**Use environment variables:**
```javascript
// Use PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

**Update API URL in frontend:**
```javascript
// Development
const API_URL = 'http://localhost:3000/tasks';

// Production (update after deploying)
const API_URL = 'https://your-app.railway.app/tasks';

// Or detect automatically
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/tasks'
    : 'https://your-app.railway.app/tasks';
```

### 3. Deployment Platforms

**Backend:**
- Railway (easiest, free)
- Heroku (popular, limited free)
- Render (free tier)

**Database:**
- Supabase (free PostgreSQL)
- Railway (includes database)
- Neon (free PostgreSQL)

**Frontend:**
- Netlify (easiest, free)
- Vercel (free, fast)
- GitHub Pages (free)

### 4. Deployment Checklist

**Before deploying:**
- [ ] Code works locally
- [ ] Environment variables set up
- [ ] .env in .gitignore
- [ ] Database tables created
- [ ] Frontend API URL updated

**After deploying:**
- [ ] Test all endpoints
- [ ] Test authentication
- [ ] Test frontend connects to backend
- [ ] Check error handling

## Next Steps:
We'll deploy each part step by step in the next lessons!

