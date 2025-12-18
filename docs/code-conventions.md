--------------------------------------------------
LINTING & CODE CONVENTIONS (MANDATORY)
--------------------------------------------------

These rules must be followed for all code changes.

--------------------------------------------------
1. JAVASCRIPT & REACT
- JavaScript only (no TypeScript)
- Functional components only
- No class components
- Prefer named functions over anonymous exports
- No inline component definitions inside render blocks

--------------------------------------------------
2. NEXT.JS APP ROUTER RULES
- page.js → orchestration only
- layout.js → structure only
- Components handle rendering
- No heavy JSX in layouts
- No data fetching inside client components unless unavoidable

--------------------------------------------------
3. SERVER / CLIENT DISCIPLINE
- Server components by default
- `"use client"` only when strictly required
- Never place `"use client"` in shared layout wrappers
- Avoid importing client components into server-heavy trees unless required

--------------------------------------------------
4. FILE SIZE & COMPLEXITY
- Components over 150–200 lines must be split
- Pages over 250 lines must be decomposed
- Avoid deeply nested JSX (>4 levels)

--------------------------------------------------
5. NAMING CONVENTIONS
- Components: PascalCase
- Hooks: camelCase starting with `use`
- Props: descriptive, not abbreviated
- Event handlers: handleX (e.g., handleSubmit)

--------------------------------------------------
6. IMPORT RULES
- No unused imports
- No circular imports
- Group imports:
  1. React / Next
  2. External libraries
  3. Internal components
  4. Utilities
- Prefer absolute imports if configured

--------------------------------------------------
7. STATE MANAGEMENT
- State lives as high as necessary, no higher
- Avoid prop drilling beyond 2 levels
- UI-only state stays in UI components
- Business logic stays in pages, server actions, or helpers

--------------------------------------------------
8. SUPABASE RULES
- Supabase logic lives outside UI components
- UI receives data + callbacks via props
- No auth logic duplication

--------------------------------------------------
9. COMMENTS & DOCS
- Comment WHY, not WHAT
- No obvious comments
- Add comments only where logic is non-obvious

--------------------------------------------------
10. ERROR HANDLING
- Handle empty states
- Handle loading states
- Avoid silent failures
- Surface meaningful UI feedback

--------------------------------------------------
11. FINAL QUALITY GATE
Before changes are accepted:
- App builds successfully
- No console warnings or errors
- No hydration mismatches
- UI output unchanged unless explicitly requested
