# Railway Deployment - Quick Action Checklist

## ✅ What's Been Done Locally

- [x] Backend Dockerfile created (`backend/Dockerfile`)
- [x] Backend .dockerignore created (`backend/.dockerignore`)  
- [x] Backend configured to serve frontend static files (`src/app.js`)
- [x] AI Service configured for Railway CORS (`app/config.py`)
- [x] Frontend built (`npm run build` completed)
- [x] railway.json configuration created

## 📋 Your Railway Deployment Steps

### 1. Prepare Code (NOW)
```bash
# Commit and push to GitHub
cd /d/clonetest
git add -A
git commit -m "Configure for Railway deployment: Add Dockerfile, static serving, build frontend"
git push origin main
```

### 2. Create Railway Account (if needed)
- Go to https://railway.app
- Sign up or login
- Create new project

### 3. Deploy Backend Service
```
Railway Dashboard → New Service → GitHub Repo
├── Dockerfile: backend/Dockerfile
├── Variables (set in Dashboard):
│   ├── NODE_ENV: production
│   ├── JWT_SECRET: <generate-new-random-32-char-string>
│   ├── MONGO_URI: mongodb+srv://Trilok123:123@cluster0.x8or3ck.mongodb.net/test-train-project
│   ├── FRONTEND_URL: https://<backend-railway-url>  (update after deployment)
│   └── AI_SERVICE_URL: https://<ai-railway-url>  (update after first deployment)
└── Deploy
```

### 4. Deploy AI Service
```
Railway Dashboard → New Service → GitHub Repo
├── Dockerfile: ai-service/Dockerfile
├── Variables:
│   ├── PORT: 8000
│   ├── CORS_ORIGINS: https://<backend-railway-url>
│   └── OLLAMA_ENABLED: false
└── Deploy
```

### 5. Get URLs and Update
After both deploy:
1. Note Backend URL (e.g., `https://app-prod.railway.app`)
2. Note AI Service URL (e.g., `https://ai-prod.railway.app`)
3. Update Backend Variables:
   - `FRONTEND_URL` = Backend URL
   - `AI_SERVICE_URL` = AI Service URL

### 6. Test Deployment
```bash
# Test backend health
curl https://<your-backend-url>/api/health

# Test AI service
curl https://<your-ai-url>/health

# Login in browser
https://<your-backend-url>
Email: presenter@expo.test
Password: Test@1234
```

## 📂 Files Created/Modified

```
✅ CREATED: backend/Dockerfile                (multi-stage build)
✅ CREATED: backend/.dockerignore             (reduces image size)
✅ CREATED: railway.json                      (service config)
✅ CREATED: RAILWAY_DEPLOYMENT.md             (full guide)
✅ MODIFIED: backend/src/app.js               (serve static files)
✅ MODIFIED: ai-service/app/config.py         (dynamic PORT)
✅ BUILT: frontend/dist/                      (production build)
```

## 🚀 Key Points

- **Frontend is bundled with backend** - no separate frontend deployment needed
- **AI Service runs separately** - connects to backend via HTTP
- **MongoDB Atlas** - already configured, just needs whitelist update
- **Dynamic PORT** - Railway assigns this automatically
- **Costs** - ~$10-50/month depending on usage

## ⚠️ Important

1. Change `JWT_SECRET` to something random (32+ characters)
2. Update MongoDB Atlas IP whitelist for Railway IPs
3. Environment variables are set in Railway Dashboard, not in .env files
4. After deployment, update service URLs for each component

## 🔗 Quick Links

- Railway Docs: https://docs.railway.app
- MongoDB IP Whitelist: https://cloud.mongodb.com/v2/<project>/security/ip_access_list
- Your Repo: Push to GitHub and deploy from there

---

## Next: Git Commit and Deploy

Run these commands to push to GitHub:

```bash
cd /d/clonetest/ai-train-traffic-control
git add backend/Dockerfile backend/.dockerignore backend/src/app.js
git add ai-service/app/config.py
git add railway.json RAILWAY_DEPLOYMENT.md
git commit -m "Configure project for Railway deployment"
git push origin main
```

Then follow the "Deploy Backend Service" steps above in the Railway Dashboard.

✨ You're ready to deploy!
