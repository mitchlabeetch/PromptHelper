## 2024-05-23 - Dynamic Imports for Heavy Interactive Components

**Learning:**
In Next.js App Router, components used in conditional rendering (like our wizard steps) are included in the initial page bundle if imported statically, even if not rendered initially. This increases TTI and LCP.
Specifically, `PlanDisplay` imports `jspdf` (large) and `ChatInterface` imports `react-markdown` (large).

**Action:**
Use `next/dynamic` with `ssr: false` for interactive, client-side-only components that have heavy dependencies or are not needed immediately (below the fold or conditional).
When using named exports, remember to use the `.then(mod => mod.Component)` pattern.

```tsx
const PlanDisplay = dynamic(
  () => import("@/components/wizard/PlanDisplay").then((mod) => mod.PlanDisplay),
  { ssr: false }
);
```
