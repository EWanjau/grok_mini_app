# Client-only state, share links, and GitHub Pages

All calculation state stays in the browser. Shareable links encode inputs in the query string only—no saved results server-side. The v1 app ships as a static Vite SPA deployed to GitHub Pages from this repo (`apps/salary-calculator`), with analytics limited to aggregate events that never include salary amounts.
