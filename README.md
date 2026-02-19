# Hearthspace Landing Page

**Status:** Ready to deploy  
**Tech:** Node.js + Express + SQLite + Vanilla JS

---

## Quick Start

```bash
cd hearthspace-landing
npm install
npm start
```

Landing page: `http://localhost:3000`  
Dashboard: `http://localhost:3000/dashboard.html`

---

## What's Included

### Landing Page (`public/index.html`)
- Hero section with clear value prop
- Problem/solution framework
- Feature cards
- Pricing preview
- Email capture form with optional survey

### Backend (`server.js`)
- Express server
- SQLite database for signups
- Email capture API endpoint
- Stats API for dashboard
- CSV export

### Dashboard (`public/dashboard.html`)
- Real-time signup tracking
- Progress toward goal (50 signups)
- Conversion rate (% willing to pay)
- Recent signups list
- CSV export button

---

## Deployment Options

### Option 1: Free Hosting (Recommended for Validation)

**Railway.app** (easiest, free tier available):
1. Create account at railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect this repo
4. Railway auto-detects Node.js
5. Done! You get a URL like `yourapp.railway.app`

**Render.com** (alternative):
1. Create account at render.com
2. New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Free tier includes custom domain

**Fly.io** (slightly more technical):
```bash
fly launch
fly deploy
```

### Option 2: VPS (If you have one)

SSH into your server:
```bash
cd /var/www
git clone [your-repo]
cd hearthspace-landing
npm install
npm start &
```

Set up reverse proxy (nginx):
```nginx
server {
    listen 80;
    server_name hearthspace.app;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

---

## Custom Domain Setup

After deploying, point your domain to the hosting platform:

**For Railway/Render:**
- Add custom domain in platform settings
- Update DNS A record to their IP
- Wait 5-60 min for propagation

**For Fly.io:**
```bash
fly certs add hearthspace.app
```

---

## Email Capture

Signups are stored in `signups.db` (SQLite).

**Export signups:**
- Via dashboard: Click "Export CSV"
- Via curl: `curl http://localhost:3000/api/export > signups.csv`

**Email integration (optional post-validation):**
To send confirmation emails, integrate:
- SendGrid (free tier: 100/day)
- Mailgun (free tier: 5k/month)
- Resend (simple API)

For now, we're keeping it simple — just capture emails, no auto-responder.

---

## Analytics

**Current:** Basic console logging

**To add (optional):**
- Plausible: Privacy-friendly, simple script tag
- Simple Analytics: Similar to Plausible
- PostHog: Open-source, more features

Add script tag to `public/index.html` `<head>`:
```html
<script defer data-domain="hearthspace.app" src="https://plausible.io/js/script.js"></script>
```

---

## Monitoring During Validation

**Dashboard:** Check `http://your-domain.com/dashboard.html` daily

**Key Metrics:**
- Total signups (Goal: 50+)
- Would pay $15/mo (Goal: 3+ "yes")
- Conversion rate (% willing to pay)

**Daily Checklist:**
1. Check dashboard for new signups
2. Read survey responses (look for pain language)
3. Reach out to "open to call" respondents
4. Document insights in `validation/learning-calls.md`

---

## Troubleshooting

**Port already in use:**
```bash
lsof -i :3000
kill -9 [PID]
```

**Database locked:**
Stop server, delete `signups.db`, restart (signups lost — only do in dev)

**CORS errors:**
Shouldn't happen with this setup, but if deploying separately:
- Update `cors()` config in `server.js`

---

## Next Steps After Deployment

1. ✅ Deploy to Railway/Render/Fly
2. ✅ Point custom domain (if purchased)
3. ✅ Test signup flow end-to-end
4. ✅ Check dashboard works
5. ✅ Share URL with warm network (10 friends)
6. ✅ Post to Reddit (Day 2)
7. ✅ Post to HN/Twitter (Day 3)
8. ✅ Run user interviews (Days 4-5)
9. ✅ Analyze results (Day 6)
10. ✅ Decide: Build, pivot, or kill (Day 7)

---

## Security Notes

- No authentication on dashboard (add if you want, but not needed for validation)
- SQLite file is local (back up regularly if deploying)
- Email validation is basic (just checks for `@`)
- No rate limiting (add if you get spam)

For validation sprint, this is fine. If you scale, add:
- Rate limiting (express-rate-limit)
- Better email validation
- Dashboard auth
- Database backups

---

**You're ready to launch. Let's go.**
