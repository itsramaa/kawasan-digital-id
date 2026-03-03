

## Plan: Add Decorative Background Elements to All Landing Pages

### Problem
All landing pages currently have plain white/gradient backgrounds with only 2-3 blurred circles in hero sections. The rest of each page is visually empty, making the experience feel flat.

### Approach
Create a reusable `FloatingElements` component that renders lightweight CSS-only decorative shapes (no heavy libraries). These are pure CSS geometric elements with existing `float-slow`/`float-medium` keyframes -- zero bundle cost, no 3D or Lottie needed for this level of visual richness.

### New Component: `src/shared/components/common/FloatingElements.tsx`

A set of CSS-animated decorative shapes (circles, rings, dots, rounded squares, gradient lines) scattered across sections. Each page gets a unique `variant` prop for visual variety:

- **`default`** (LandingHome) -- Mixed shapes: rings, dots, gradient bars
- **`organic`** (AboutPage) -- Softer: circles, rounded blobs
- **`tech`** (ServicesPage) -- Geometric: squares, code brackets, grid dots
- **`creative`** (PortfolioPage) -- Dynamic: diamond shapes, diagonal lines
- **`minimal`** (ContactPage) -- Subtle: small dots, thin rings

Each variant places 8-12 absolutely-positioned elements with:
- `opacity-[0.04]` to `opacity-[0.08]` (very subtle, not distracting)
- Existing `float-slow` / `float-medium` animations
- `pointer-events-none` so they don't interfere with interaction
- Mix of `border` shapes (no fill = very lightweight) and small gradient fills

### New CSS additions to `index.css`
- `@keyframes float-diagonal` -- slight diagonal drift for variety
- `@keyframes spin-slow` -- very slow rotation (30s cycle) for geometric shapes
- `.dot-grid` -- repeating dot pattern background using `radial-gradient`

### Changes Per Page

All pages get `<FloatingElements variant="..." />` placed as a fixed/absolute layer behind content in the main wrapper (inside `<LandingLayout>` children, before sections).

Additionally, enhance empty section backgrounds:

| Page | Sections Enhanced |
|---|---|
| **LandingHome** | Stats, Why Us, Device Preview, CTA -- add dot grid bg + floating rings |
| **AboutPage** | Vision/Mission, Team, Timeline -- add organic blobs + soft gradient patches |
| **ServicesPage** | Services Grid, Tech Stack, CTA -- add geometric shapes + grid pattern |
| **PortfolioPage** | Project grid area, CTA -- add creative shapes between cards |
| **ContactPage** | Form area, FAQ -- add minimal dots + thin accent lines |

### Files to modify
1. **NEW** `src/shared/components/common/FloatingElements.tsx` -- Reusable decorative layer
2. `src/index.css` -- Add 2 new keyframes + dot-grid utility
3. `src/pages/landing/LandingHome.tsx` -- Add FloatingElements + section bg decorations
4. `src/pages/landing/AboutPage.tsx` -- Add FloatingElements + section bg decorations
5. `src/pages/landing/ServicesPage.tsx` -- Add FloatingElements + section bg decorations
6. `src/pages/landing/PortfolioPage.tsx` -- Add FloatingElements + section bg decorations
7. `src/pages/landing/ContactPage.tsx` -- Add FloatingElements + section bg decorations

### Performance
- Pure CSS only -- no JS runtime cost, no external libraries
- All elements use `will-change: transform` via the existing keyframes
- Very low opacity ensures they enhance without overwhelming

