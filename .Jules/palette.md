## 2024-05-23 - Accessibility Improvements
**Learning:** Icon-only buttons and clickable divs are common patterns that often lack accessibility features. Adding `aria-label` and converting `div` to `button` significantly improves the experience for screen reader and keyboard users.
**Action:** Always check for `onClick` on non-interactive elements and missing `aria-label` on icon buttons during code review.

## 2024-05-24 - Transient Loading States
**Learning:** Screen readers may miss transient loading states like "Thinking..." if they aren't marked with `role="status"` and `aria-live="polite"`. Purely decorative loading spinners should be hidden with `aria-hidden="true"` to reduce noise.
**Action:** Wrap temporary status messages in a container with `role="status"` and ensure decorative icons are explicitly hidden from assistive technology.
