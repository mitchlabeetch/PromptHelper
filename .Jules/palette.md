## 2024-05-23 - Accessibility Improvements
**Learning:** Icon-only buttons and clickable divs are common patterns that often lack accessibility features. Adding `aria-label` and converting `div` to `button` significantly improves the experience for screen reader and keyboard users.
**Action:** Always check for `onClick` on non-interactive elements and missing `aria-label` on icon buttons during code review.
