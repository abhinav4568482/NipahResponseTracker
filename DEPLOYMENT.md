# Deployment Guide - Render

This project is configured for deployment on **Render**.

## Prerequisites

1. A GitHub repository with your code pushed
2. A Render account (https://render.com)
3. A PostgreSQL database (Neon recommended)

## Setup Steps

### 1. Create PostgreSQL Database (Neon)

1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@host.neon.tech:5432/db`)

### 2. Deploy on Render

1. **Sign in to Render** at https://render.com
2. **Create New Web Service**
   - Connect your GitHub repository
   - Select your repo
   
3. **Configure Service**
   - **Name**: `nipah-response-tracker` (or your choice)
   - **Runtime**: Node
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

4. **Add Environment Variables**
   Click "Add Environment Variable" and add:
   
   ```
   DATABASE_URL = postgresql://user:password@host.neon.tech:5432/db
   SESSION_SECRET = [generate-a-random-secure-string]
   NODE_ENV = production
   ```
   
   To generate SESSION_SECRET, run in terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Add Pre-Deploy Hook** (optional but recommended)
   - In "Pre-deploy command" field: `npm run db:push`
   - This runs Drizzle migrations automatically

6. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your app automatically

## Post-Deployment

- Your app will be live at: `https://your-service-name.onrender.com`
- Free tier instances spin down after 15 minutes of inactivity
- For production, upgrade to a paid plan

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all environment variables are set
- Verify `npm run build` works locally

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database exists and is accessible
- Ensure `npm run db:push` runs successfully

### Application Crashes
- Check logs in Render dashboard
- Verify SESSION_SECRET is set
- Check NODE_ENV is set to `production`

## Manual Updates

After pushing code to GitHub:
1. Render automatically redeploys
2. Or manually trigger via Render dashboard → "Deploy latest commit"

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| SESSION_SECRET | Yes | Secure session key (min 32 chars) |
| NODE_ENV | Yes | Set to `production` |

## File Structure for Deployment

```
.
├── render.yaml          # Render configuration (already configured)
├── .env.example         # Example environment variables
├── package.json         # Build & start commands configured
├── server/
│   ├── index.ts         # Express server
│   └── routes.ts        # API routes
├── client/
│   └── src/             # React frontend
└── shared/
    └── schema.ts        # Database schema
```

## Support

- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs
- Project Issues: Check GitHub repository
