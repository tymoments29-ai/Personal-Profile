# Modernizing Portfolio UI/UX Design

This plan outlines the steps to elevate the visual appeal of the portfolio website by adding modern web design aesthetics such as animations, glassmorphism, and hover effects, using the already installed `framer-motion` library.

## Proposed Changes

We will modify several frontend components to make the website feel more dynamic, premium, and alive.

### 1. Page Transitions (Framer Motion)
We will wrap the main content area with an `AnimatePresence` so that whenever the user switches tabs (e.g., from About to Portfolio), the old page fades out and the new page slides up gracefully.

#### [MODIFY] `src/components/layout/PublicLayoutClient.tsx`
- Use `usePathname` from `next/navigation` (or `@/navigation`).
- Wrap the main `<motion.div>` with `<AnimatePresence mode="wait">`.
- Change the `key` of the `<motion.div>` to be `pathname` so it triggers the transition on every route change.

### 2. Shimmering Text Effect
We will add a "shimmer" or shining text effect to prominent headings, such as your Name in the sidebar or the main titles on the About page.

#### [MODIFY] `src/app/globals.css`
- Add a new `.animate-shimmer` utility class using CSS keyframes to create a shining metallic/gold text effect.

#### [MODIFY] `src/components/layout/Sidebar.tsx`
- Apply the `.animate-shimmer` class to your name (`Sukristiyo`).
- Add a subtle floating animation (breathing effect) to your Profile Picture using `framer-motion` (`animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity }}`).

### 3. Portfolio Staggered Animations & Spotlight Cards
When a user opens the Portfolio page, the project cards shouldn't just appear simultaneously. They should appear one by one rapidly (staggered). Also, we will enhance the card hover effect.

#### [MODIFY] `src/components/public/portfolio/ProjectGrid.tsx` (or equivalent component)
- Convert the grid container to a `motion.div` with `staggerChildren`.
- Wrap each `ProjectCard` inside a `motion.div` with a fade-in-up variant.

#### [MODIFY] `src/components/public/portfolio/ProjectCard.tsx` (or equivalent component)
- Add a subtle hover spotlight or glow effect using `framer-motion` or Tailwind CSS group-hover utilities.

### 4. Resume Interactive Timeline
We will make the timeline dots in the Resume page pulse or glow slightly to draw attention.

#### [MODIFY] Resume Page Components
- Add a `glow-gold` class to the timeline active indicators.

---

## Open Questions for Execution
1. **Shimmering Effect:** Make it continuous and subtle, or only activate on hover? (Defaulting to continuous but very slow).
2. **Page Transitions:** Defaulting to "Fade In & Slide Up" for a clean, modern feel.
