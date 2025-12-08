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

**Total effective capacity**: With Groq as primary and proper rate limiting, the app can handle **30+ requests per minute** for the world. We must find ways to improve that -> self-input of API key? Probably too "technical" for a share of the targetted users (AI-beginners)
