--------------------------------------------------
COMPONENT CREATION CHECKLIST (ENFORCED)
--------------------------------------------------

Before creating ANY new UI component, follow this checklist strictly.

1. COMPONENT PURPOSE
   - Does this component solve ONE clear UI responsibility?
   - Can its purpose be described in one sentence?

If NO → split it.

--------------------------------------------------
2. SERVER vs CLIENT DECISION (REQUIRED)

Default to SERVER COMPONENT.

Only mark as `"use client"` if the component:
- Uses React hooks (useState, useEffect, useRef, etc.)
- Handles user interaction (onClick, onChange, drag, hover)
- Manages form state
- Controls modals, dropdowns, animations, or toasts
- Uses client-side Supabase auth hooks

RULE:
- If only a child needs interactivity, the parent MUST remain server-side.
- `"use client"` should appear in the smallest leaf component possible.

--------------------------------------------------
3. FILE LOCATION
Choose the correct folder:
- components/ui → generic reusable UI
- components/forms → input + submission logic
- components/cards → data display blocks
- components/tables → tabular data
- components/layout → structural wrappers
- components/admin → admin-only UI
- components/client → client-facing UI

If the component is reused in more than one area → it MUST be shared.

--------------------------------------------------
4. FILE RULES
- One component per file
- File name matches component name exactly
- No default exports for utility helpers (components are fine)
- No index files unless already used in the repo

--------------------------------------------------
5. PROPS & DATA FLOW
- All data comes in via props
- No hardcoded business data
- No Supabase queries inside UI components
- No mutation of props
- State only allowed for UI behavior

--------------------------------------------------
6. STYLING RULES
- Reuse existing classNames
- Do NOT invent new spacing or colors without reuse
- Extract repeated class strings when necessary
- Visual output must match existing UI patterns

--------------------------------------------------
7. ACCESSIBILITY & UX
- Buttons must use <button>
- Inputs must have labels (or aria-label)
- Click targets must be keyboard accessible
- Loading and empty states must be handled

--------------------------------------------------
8. PERFORMANCE CHECK
- Is this component unnecessarily client-side?
- Can it render fully on the server?
- Is memoization actually needed? (usually no)

--------------------------------------------------
9. FINAL VALIDATION
Before committing:
- Component renders correctly
- No hydration warnings
- No console errors
- No breaking changes to parent components
