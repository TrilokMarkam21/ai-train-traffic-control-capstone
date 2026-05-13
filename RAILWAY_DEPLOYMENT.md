# Railway Deployment Guide - AI Train Traffic Control

## ✅ Pre-Deployment Setup Complete

Your project is now configured for Railway deployment:

✅ Backend Dockerfile created  
✅ Frontend built and ready  
✅ Static file serving configured  
✅ Environment variables configured  
✅ AI Service Dockerfile exists  

---

## Quick Start: Deploy to Railway (5 minutes)

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in or create an account
3. Create a new project
4. Select "GitHub" and connect your repo

### Step 2: Configure Backend Service

In Railway Dashboard:

1. Click **+ Create Service**
2. Select **GitHub Repo** → Select your clonetest repo
3. Set the following:

```
Service Name: backend
Dockerfile: backend/Dockerfile
Deployment Type: Docker
```

4. Go to **Variables** and add:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this-32chars-min
MONGO_URI=mongodb+srv://Trilok123:123@cluster0.x8or3ck.mongodb.net/test-train-project
FRONTEND_URL=https://<your-railway-domain>.railway.app
AI_SERVICE_URL=https://<ai-service-railway-domain>.railway.app
SIMULATION_INTERVAL_MS=3000
LOG_LEVEL=info
```

5. Click **Deploy**

### Step 3: Configure AI Service

1. Click **+ Create Service**
2. Select **GitHub Repo** → Select your clonetest repo
3. Set:

```
Service Name: ai-service
Dockerfile: ai-service/Dockerfile
```

4. Go to **Variables** and add:

```
PORT=8000
CORS_ORIGINS=https://<your-railway-domain>.railway.app
OLLAMA_ENABLED=false
```

5. Click **Deploy**

### Step 4: Get Your URLs

After deployment completes:

1. Click on **backend** service
2. Find **Public URL** (looks like `https://yourapp.railway.app`)
3. Update:
   - `FRONTEND_URL` in backend service
   - `VITE_API_URL` in frontend env variables
   - `AI_SERVICE_URL` in backend service

### Step 5: Verify Deployment

Test your deployment:

```bash
# Test backend health
curl https://<your-railway-domain>.railway.app/api/health

# Test AI service health
curl https://<ai-service-railway-domain>.railway.app/health

# Test frontend (should see login page)
curl https://<your-railway-domain>.railway.app/
```

---

## Detailed Configuration

### Backend Service Configuration

**Environment Variables:**
- `NODE_ENV=production` - Must be production
- `JWT_SECRET=<generate-strong-random-string>` - 32+ chars, random
- `MONGO_URI=mongodb+srv://...` - MongoDB Atlas connection string
- `FRONTEND_URL=https://<railway-backend-url>` - For CORS
- `AI_SERVICE_URL=https://<railway-ai-url>` - AI service connection

**Ports:**
- Railway automatically assigns a `PORT` environment variable
- Backend listens on this port (default 5000 if not set)
- Exposed on public URL

### AI Service Configuration

**Environment Variables:**
- `PORT=8000` - AI service port
- `CORS_ORIGINS=<backend-url>` - Comma-separated origins allowed
- `OLLAMA_ENABLED=false` - Disable Ollama (uses local XGBoost)

**Ports:**
- Runs on port 8000
- Must be accessible from backend service

### Database

MongoDB Atlas is already set up with:
- Host: cluster0.x8or3ck.mongodb.net
- Database: test-train-project
- Collections: Users, Trains, Sections, etc.

**Important:** 
- Update IP whitelist in MongoDB Atlas to include Railway's IP ranges
- Or use "Allow access from anywhere" (⚠️ only for demo/test)

### Frontend

- Pre-built and bundled with backend
- Served as static files from `/dist`
- Build happens during Docker build process
- Environment variables are build-time only

---

## Testing After Deployment

### Test Login
```
Email: presenter@expo.test
Password: Test@1234
```

### API Endpoints to Test

```bash
# Health check
GET /api/health

# Get trains
GET /api/trains

# Get sections
GET /api/sections

# AI prediction
POST /api/ai/predict
Body: {"train_id": "T001", "section_id": "S001"}
```

### WebSocket Test
Open browser console and check:
```javascript
// Should connect without errors
const socket = io(window.location.origin);
socket.on('connect', () => console.log('Connected'));
```

---

## Troubleshooting

### Service Won't Start
1. Check Railway logs: Click service → **Logs**
2. Verify environment variables are set
3. Check PORT is assigned (Railway env var)

### Frontend Not Showing
1. Check backend is serving static files
2. Verify `/dist` directory exists in Docker build
3. Check browser console for 404 errors

### Cannot Connect to AI Service
1. Verify AI service is deployed and running
2. Check `AI_SERVICE_URL` in backend env vars matches actual URL
3. Check CORS configuration in AI service

### Database Connection Error
1. Verify `MONGO_URI` is correct
2. Add Railway IPs to MongoDB Atlas whitelist
3. Check credentials are correct

### WebSocket Connection Issues
1. Check CORS configuration
2. Verify Socket.IO is properly configured
3. Check firewall/proxy settings

---

## Post-Deployment

### Update MongoDB Credentials
Current credentials are exposed in `.env`. After deployment:

1. Create new MongoDB user
2. Update `MONGO_URI` in Railway
3. Update backend service variables

### Monitor Logs
```bash
# In Railway Dashboard
1. Click Backend service
2. Go to Logs tab
3. Watch real-time logs
```

### Scale Services
```
Railway Dashboard → Service Settings → Instances/Memory
(Pay per usage)
```

### Custom Domain
```
Railway Dashboard → Domains → Add Custom Domain
```

---

## Local Testing Before Railway

To test locally before deploying to Railway:

```bash
# Build backend Docker image
cd backend
docker build -t ai-backend .

# Run with environment variables
docker run -p 3000:3000 \
  -e MONGO_URI="mongodb://..." \
  -e JWT_SECRET="test-secret" \
  -e NODE_ENV="production" \
  ai-backend

# Test
curl http://localhost:3000/api/health
```

---

## Costs

**Railway Pricing:**
- $5/month base account
- Pay per resource usage (CPU, Memory, Bandwidth)
- Estimated: $10-50/month depending on traffic

**Breakdown:**
- Backend service: ~$15-20/month
- AI service: ~$10-15/month (heavy on CPU/memory)
- MongoDB Atlas: $0-9/month (free tier or paid)

---

## Next Steps

1. ✅ Push code to GitHub
2. Connect repo to Railway
3. Configure environment variables
4. Deploy both services
5. Test endpoints
6. Monitor logs
7. Update MongoDB whitelist if needed

---

## Support

- Railway Docs: https://docs.railway.app
- GitHub Issues: Check your repo for deployment logs
- MongoDB Docs: https://docs.atlas.mongodb.com

---

**Need help?** Check Railway dashboard → Logs for detailed error messages.
