# Bolt's Journal

## 2024-05-23 - Initial Setup
**Learning:** Bolt journal initialized.
**Action:** Always check this file for critical learnings before starting.

## 2024-05-23 - Component Separation for Performance
**Learning:** `ChatInterface` was re-rendering the entire message list (including `ReactMarkdown` parsing inside `MessageItem`) on every keystroke because the input state was in the same component. Even with `React.memo` on `MessageItem`, the list reconciliation cost adds up.
**Action:** Split components that handle frequent state updates (like inputs) from heavy list renderers. Created `MessageList` to isolate the list rendering from the input state.
