# Frontend Deployment

## Deploying Your Frontend
Put your HTML/CSS/JavaScript files online so users can access your app.

## Key Concepts:

### 1. Deploying to Netlify (Easiest)

**Step 1: Sign Up**
1. Go to netlify.com
2. Sign up (free)

**Step 2: Deploy**
1. Drag and drop your frontend folder
2. Or connect GitHub repo
3. Netlify automatically deploys

**Step 3: Update API URL**
```javascript
// Change from localhost to your Railway URL
const API_URL = 'https://your-backend.railway.app/tasks';
```

**Step 4: Get Your URL**
- Netlify gives you: `https://your-app.netlify.app`
- Share this URL!

### 2. CORS Setup

**If frontend and backend on different domains:**
```javascript
// Backend (server.js)
const cors = require('cors');
app.use(cors());
```

**This allows frontend to call backend from different domain.**

### 3. Testing

**After deployment:**
1. Visit your Netlify URL
2. Test login
3. Test creating tasks
4. Test all features

## Practice:
1. Deploy frontend to Netlify
2. Update API URL
3. Test everything works
4. Share your live app!

## Congratulations!
Your full-stack app is now live! 🎉

