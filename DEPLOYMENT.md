# Deployment Guide - PromptHelper Web App

## GitHub Secrets Configuration

For deploying this application, you need to configure the following secrets in your GitHub repository:

### Required Secrets

Go to **Settings > Secrets and variables > Actions** in your GitHub repository and add:

1. **`GROQ_API_KEY`** (Primary LLM Provider)
   - Get your free API key from: https://console.groq.com/keys
   - Free tier: **30 requests per minute** (RPM)
   - Model used: Llama 3.3 70B Versatile
   - **This is now the primary LLM** for all operations

2. **`GOOGLE_API_KEY`** (Fallback LLM Provider)
   - Get your free API key from: https://aistudio.google.com/app/apikey
   - Free tier: ~15 requests per minute (varies)
   - Model used: Gemini 1.5 Flash
   - **Used as fallback** when Groq is unavailable

### Optional Secrets (for future enhancements)

3. **`NEXTAUTH_SECRET`** (if you add authentication)
   - Generate with: `openssl rand -base64 32`

4. **`DATABASE_URL`** (if you add persistent storage)
   - Connection string for your database

## API Rate Limits & Protection

This application now includes **built-in rate limiting** to protect against API abuse:

### Rate Limits by Endpoint

- **Chat API** (`/api/architect/chat`): 15 requests/minute per IP
- **Selection API** (`/api/architect/select`): 10 requests/minute per IP
- **Plan Generation** (`/api/architect/plan`): 8 requests/minute per IP
- **Plan Revision** (`/api/architect/plan/revise`): 5 requests/minute per IP

### How Rate Limiting Works

1. **IP-based tracking**: Each user's requests are tracked by their IP address
2. **In-memory storage**: Rate limit counters are stored in server memory
3. **Automatic cleanup**: Old entries are cleaned up every 5 minutes
4. **Fair use**: Limits are set to balance user experience with API constraints

### LLM Provider Free Tier Limits

#### Groq (Primary)
- **30 requests per minute** (RPM)
- **14,400 requests per day**
- **6,000 tokens per minute**
- Model: Llama 3.3 70B Versatile

#### Google Gemini (Fallback)
- **~15 requests per minute** (varies by region)
- **1,500 requests per day** (free tier)
- Model: Gemini 1.5 Flash

**Total effective capacity**: With Groq as primary and proper rate limiting, the app can handle **30+ requests per minute** for the world.

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Configure Environment Variables** in Vercel Dashboard:
   - `GROQ_API_KEY`
   - `GOOGLE_API_KEY`
3. **Deploy**: Vercel will automatically build and deploy

Vercel URL: https://vercel.com/new

### Option 2: GitHub Pages (Static Export)

**Note**: GitHub Pages only supports static sites. This app uses API routes (server-side), so it **cannot be deployed to GitHub Pages** without significant modifications.

For GitHub Pages deployment, you would need to:
- Convert all API routes to client-side calls to external services
- Use a separate backend service (e.g., Vercel, Netlify Functions)
- This is **not recommended** as it would expose API keys in the client

### Option 3: Netlify

1. **Connect your GitHub repository** to Netlify
2. **Configure Environment Variables** in Netlify Dashboard:
   - `GROQ_API_KEY`
   - `GOOGLE_API_KEY`
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Option 4: Self-Hosted (Docker)

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t prompthelper .
docker run -p 3000:3000 \
  -e GROQ_API_KEY=your_key \
  -e GOOGLE_API_KEY=your_key \
  prompthelper
```

## Security Checklist

- ✅ **No secrets in codebase**: All API keys use environment variables
- ✅ **Rate limiting enabled**: Protects against abuse
- ✅ **`.gitignore` configured**: `.env*` files are excluded
- ✅ **Input validation**: All API endpoints validate input
- ✅ **Error handling**: Errors don't leak sensitive information
- ✅ **CORS**: Configured for production domains only (if needed)

## Testing Before Deployment

1. **Local testing with environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Add your API keys to .env.local
   npm run dev
   ```

2. **Build test**:
   ```bash
   npm run build
   npm start
   ```

3. **Rate limit testing**:
   - Make multiple rapid requests to verify limits work
   - Check browser console for rate limit headers

## Monitoring & Maintenance

### Check Rate Limit Headers

The API returns these headers with each response:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Timestamp when the limit resets

### Logs

Monitor your deployment logs for:
- Rate limit violations: `429` status codes
- API failures: Groq/Gemini errors
- High traffic patterns

### Scaling Considerations

If you need higher limits:

1. **Groq**: Contact Groq for paid plans (higher RPM)
2. **Add more fallbacks**: Integrate additional LLM providers
3. **Implement Redis**: For distributed rate limiting across multiple servers
4. **Add authentication**: Require login to track usage per user instead of IP

## Environment Variables Reference

```bash
# Required
GROQ_API_KEY=gsk_...          # Primary LLM provider (30 RPM free)
GOOGLE_API_KEY=AIza...        # Fallback LLM provider (~15 RPM free)

# Optional (for future features)
NEXTAUTH_SECRET=...           # For authentication
DATABASE_URL=...              # For persistent storage
NODE_ENV=production          # Set automatically by hosting providers
```

## Support

For issues with:
- **Groq API**: https://console.groq.com/docs
- **Google Gemini API**: https://ai.google.dev/docs
- **Deployment**: Check your hosting provider's documentation
