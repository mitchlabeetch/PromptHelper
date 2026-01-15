## 2024-05-23 - Accessibility Improvements
**Learning:** Icon-only buttons and clickable divs are common patterns that often lack accessibility features. Adding `aria-label` and converting `div` to `button` significantly improves the experience for screen reader and keyboard users.
**Action:** Always check for `onClick` on non-interactive elements and missing `aria-label` on icon buttons during code review.

## 2024-05-24 - Transient Loading States
**Learning:** Screen readers may miss transient loading states like "Thinking..." if they aren't marked with `role="status"` and `aria-live="polite"`. Purely decorative loading spinners should be hidden with `aria-hidden="true"` to reduce noise.
**Action:** Wrap temporary status messages in a container with `role="status"` and ensure decorative icons are explicitly hidden from assistive technology.

## 2024-05-25 - External Link Accessibility in Markdown
**Learning:** Using `aria-label` to indicate "opens in a new tab" on Markdown links is fragile because it overrides the link's text content, which might be rich text (bold, italic). A more robust approach is to append a visually hidden `<span>` (e.g., `sr-only`) with the warning text, preserving the natural flow of the link content for screen readers.
**Action:** When customizing link renderers in ReactMarkdown or similar libraries, favor appending `sr-only` text over overriding `aria-label` for "new tab" indicators.
