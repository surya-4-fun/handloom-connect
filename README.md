# Handloom Connect — Phase 1

React + Vite + TypeScript frontend foundation based on the approved UX blueprint.

## Included
- Production-oriented feature folder structure
- Responsive application shell and footer
- Sticky glass navigation with mega menu, search, wishlist, cart, profile and theme controls
- Token-based custom CSS design system
- Complete storytelling landing page
- React Router routes with intentional placeholders for later phases
- Local placeholder data and generated project imagery; no backend

## Run
```bash
npm install
npm run dev
```

## Validate
```bash
npm run typecheck
npm run build
```

## Structure
```text
src/
├── app/            # Router and application layouts
├── assets/         # Generated imagery and future icons/patterns
├── components/     # Shared primitives, navigation and commerce UI
├── features/       # Feature-owned pages and sections
├── pages/          # Route-level placeholders
├── mocks/          # Placeholder data
├── styles/         # Tokens, reset, global, navigation and page styles
└── types/          # Shared TypeScript contracts
```
