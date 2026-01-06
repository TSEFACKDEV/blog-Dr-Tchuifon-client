# 🚀 Quick Deployment Checklist

## Before Deployment

### Server Repository (https://github.com/TSEFACKDEV/blog-Dr-Tchuifon)
- [ ] Add `render.yaml` file
- [ ] Update `package.json` with postinstall script
- [ ] Create `.env.production.example`
- [ ] Push all changes to GitHub

### Client Repository (https://github.com/TSEFACKDEV/blog-Dr-Tchuifon-client)
- [ ] Add `vercel.json` file
- [ ] Create `.env.production.example`
- [ ] Push all changes to GitHub

---

## Deployment Steps

### 1. Deploy Backend on Render (15 minutes)
1. [ ] Sign up on [render.com](https://render.com)
2. [ ] Create PostgreSQL database
3. [ ] Copy database URL
4. [ ] Create Web Service from GitHub repo
5. [ ] Configure environment variables:
   - [ ] `NODE_ENV=production`
   - [ ] `PORT=10000`
   - [ ] `DATABASE_URL=<from step 3>`
   - [ ] `JWT_SECRET=<generate secure secret>`
   - [ ] `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`
   - [ ] `ALLOWED_ORIGINS=*` (update after Vercel deployment)
6. [ ] Click "Create Web Service"
7. [ ] Wait for deployment (5-10 min)
8. [ ] Copy your API URL: `https://your-api.onrender.com`

### 2. Deploy Frontend on Vercel (5 minutes)
1. [ ] Sign up on [vercel.com](https://vercel.com)
2. [ ] Import GitHub repository
3. [ ] Configure environment variable:
   - [ ] `VITE_API_URL=<your Render API URL>`
4. [ ] Click "Deploy"
5. [ ] Wait for deployment (2-3 min)
6. [ ] Copy your app URL: `https://your-app.vercel.app`

### 3. Update CORS Configuration
1. [ ] Go back to Render dashboard
2. [ ] Update `ALLOWED_ORIGINS` with your Vercel URL
3. [ ] Save and wait for automatic redeployment

### 4. Test Everything
- [ ] Visit your Vercel URL
- [ ] Test user authentication
- [ ] Test API calls
- [ ] Check browser console for errors

---

## Important URLs

**Server GitHub**: https://github.com/TSEFACKDEV/blog-Dr-Tchuifon
**Client GitHub**: https://github.com/TSEFACKDEV/blog-Dr-Tchuifon-client

**Render Dashboard**: https://dashboard.render.com/
**Vercel Dashboard**: https://vercel.com/dashboard

**Your API URL**: `_____________________________`
**Your App URL**: `_____________________________`

---

## Generate JWT Secret

### Windows PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### Linux/Mac:
```bash
openssl rand -base64 32
```

---

## Free Plan Limits

**Render Free**:
- 750 hours/month
- Sleeps after 15 min inactivity
- ~50s cold start

**Vercel Free**:
- 100 GB bandwidth/month
- Unlimited builds
- No sleep!

---

## Need Help?

Check [GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md) for detailed instructions.
