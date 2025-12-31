## 2024-05-23 - API Security Hardening
**Vulnerability:** DoS risk via unlimited string input in `plan` API route, and potential rate limit bypass due to naive IP extraction.
**Learning:** Even with Zod, explicit `.max()` limits must be applied to all string inputs. IP extraction logic must handle `X-Forwarded-For` chains correctly (taking the first IP) to be robust against spoofing or proxy chains.
**Prevention:** Use a standardized `getIP` helper across all routes. Ensure every `z.string()` in API schemas has a reasonable `.max()` limit.
